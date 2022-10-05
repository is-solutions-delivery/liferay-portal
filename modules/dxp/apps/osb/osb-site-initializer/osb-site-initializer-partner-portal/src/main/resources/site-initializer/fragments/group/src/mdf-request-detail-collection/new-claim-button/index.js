const currentPath = Liferay.currentURL.split('/')
const mdfRequestedId = +currentPath[currentPath.length -1];
const SITE_URL = Liferay.ThemeDisplay.getLayoutRelativeURL()
				.split('/')
				.slice(0, 3)
				.join('/')

const claimButton = fragmentElement.querySelector('.newClaim')


claimButton.onclick = () => {Liferay.Util.navigate(`${SITE_URL}/marketing/mdf-claim/new/#/mdfrequest/${mdfRequestedId}`)
}