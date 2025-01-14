<#if (ObjectEntry_objectEntryId.getData())??>
<script>
	document.addEventListener("DOMContentLoaded", () => {
	  const lessonContent = document.querySelector(".lesson-content");
	  async function fetchLessons() {
		const url = `/o/c/lessons/${ObjectEntry_objectEntryId.getData()}`;
		try {
		  const response = await fetch(url);
		  if (!response.ok) {
			throw new Error('Request error: ' + response.statusText);
		  }
		  const data = await response.json();
		  return data.content_i18n.en_US
		} catch (error) {
		  console.error('Error:', error);
		}
	  }
	  async function ShowContent() {
		lessonContent.innerHTML = await fetchLessons()
	  }
	  ShowContent()
	});
</script>
</#if>
<div class="lesson-content">
</div>