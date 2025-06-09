<#if (ObjectEntry_objectEntryId.getData())?? && ObjectEntry_objectEntryId.getData()?has_content>
  <#assign assetId = ObjectEntry_objectEntryId.getData()?number>
  <#assign response = restClient.get("/c/lessons/${assetId}")>
  <#assign rawHtml = response.content>

  <#assign rawHtml = rawHtml?replace("www\\.youtube\\.com", "www.youtube-nocookie.com", "r")>

  <#assign rawHtml = rawHtml?replace(
    "(?i)<iframe[^>]*src=[\"']([^\"']*youtube-nocookie\\.com/embed/[^\"']+)[\"'][^>]*>.*?</iframe>",
    "<div class=\"video-placeholder\" data-src=\"$1\"></div>",
    "r"
  )>
</#if>

${rawHtml}

<script>
  document.addEventListener("DOMContentLoaded", () => {
    const COOKIE_PERSONALIZATION = 'CONSENT_TYPE_PERSONALIZATION';

    function isConsentGiven() {
      return Liferay.Util.Cookie.get(COOKIE_PERSONALIZATION) === 'true';
    }

    function loadVideo(placeholder) {
      const videoUrl = placeholder.getAttribute("data-src");
      if (!videoUrl) return;
      const iframe = document.createElement("iframe");
      iframe.src = videoUrl;
      iframe.frameBorder = "0";
      iframe.allowFullscreen = true;
      iframe.loading = "lazy";
      iframe.style.width = "100%";
      iframe.style.height = "490px";
      placeholder.replaceWith(iframe);
    }

    function showBlockedMessage(placeholder) {
      placeholder.classList.add("video-blocked");
      placeholder.textContent = "Accept cookies to display videos.";
      placeholder.style.cursor = "pointer";

      placeholder.onclick = () => {
        import('/o/cookies-banner-web/__liferay__/index.js')
          .then(({ openCookieConsentModal, checkCookieConsentForTypes, COOKIE_TYPES }) => {
            openCookieConsentModal({
              alertDisplayType: 'info',
              alertMessage: 'Please review your cookie preferences.',
              customTitle: 'Cookie Consent',
            }).then(() => checkCookieConsentForTypes([COOKIE_TYPES.PERSONALIZATION]))
              .then(() => runVideoConsentLogic())
              .catch(() => console.log('Cookies not accepted'));
          })
          .catch(console.error);
      };
    }

    function runVideoConsentLogic() {
      const placeholders = document.querySelectorAll(".video-placeholder");
																														 
      placeholders.forEach((placeholder) => {
        if (isConsentGiven()) {
          loadVideo(placeholder);
        } else {
          if (!placeholder.classList.contains("video-blocked")) {
            showBlockedMessage(placeholder);
          }
        }
      });
    }

    function waitForBannerHide(selector, callback) {
      const banner = document.querySelector(selector);
																														 
      if (!banner) return callback();
																														 
      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
		
        if (!el || getComputedStyle(el).display === 'none' || el.getAttribute('aria-hidden') === 'true') {
          observer.disconnect();
          callback();
        }
      });
																																																			 
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'aria-hidden'] });
    }

    function init() {
      runVideoConsentLogic();

      Liferay.on('closeModal', () => runVideoConsentLogic());
      waitForBannerHide('.cookies-banner[aria-label="banner cookies"]', () => runVideoConsentLogic());
    }

    function waitForLiferay() {
      if (typeof Liferay !== 'undefined' && Liferay.Util?.Cookie) {
        init();
        return;
      }
																				
      const observer = new MutationObserver(() => {
        if (typeof Liferay !== 'undefined' && Liferay.Util?.Cookie) {
          observer.disconnect();
          init();
        }
      });

      observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    waitForLiferay();
  });
</script>

<style>
  .embed-responsive::before {
    padding-top: 0;
  }

  .embed-responsive iframe {
    position: static;
    width: 100%;
    height: 490px;
    display: block;
  }

  .video-blocked {
    width: 100%;
    height: 490px;
    background-color: black;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
    user-select: none;
  }
</style>