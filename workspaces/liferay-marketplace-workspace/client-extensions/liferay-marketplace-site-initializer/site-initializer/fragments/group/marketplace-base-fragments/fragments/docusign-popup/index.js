/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

(() => {
    const startTrialButton = document.getElementById('start-docusign-trial');
  
    const getSiteURL = () => {
      const layoutRelativeURL = Liferay.ThemeDisplay.getLayoutRelativeURL();
  
      if (layoutRelativeURL.startsWith('/web/')) {
          return layoutRelativeURL.split('/').slice(0, 3).join('/');
      }
  
      return '';
  };
  
    const handleClick = () => {
      if (!themeDisplay.isSignedIn()) {
          startTrialButton.onclick = () => {
          sessionStorage.setItem(
            "@marketplace/redirect-to",
            window.location.href
          );
  
          location.href = `${getSiteURL()}/sign-in`;
        };
  
        return;
      }
  
      const userName = themeDisplay.getUserName()
  
      const names = userName.split(' ');
  
      DSDigitalSignup.startSignup(
          names[0],
          names[names.length - 1],
          themeDisplay.getUserEmailAddress(),
          "",
          "YOUR_PARTNER_IK_HERE",
          "https://yourapp.com/docusign/callback",
          themeDisplay.getBCP47LanguageId().toLowerCase()
      );
    };
  
    startTrialButton.addEventListener("click", handleClick);
  })();
  