/* The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

const getFileReader = (file: any) => {
	return new Promise<{result: unknown}>((resolve, reject) => {
		const fileReader: FileReader = new FileReader();

		fileReader.readAsDataURL(file);

		fileReader.onload = () => {
			resolve(fileReader);
		};

		fileReader.onerror = reject;
	});
};

export default async function setFileFormik(
	file: any,
	name: string,
	activityId?: number,
	budgetId?: number,
	mdfRequestId?: number,
	setFieldValue?: (
		field: string,
		value: any,
		shouldValidate?: boolean | undefined
	) => void,
	typeDocument?: string
) {
	const fileReader = await getFileReader(file[0]);

	const currentFile = {
		activityId: 0,
		budgetId: 0,
		fileURL: file,
		mdfRequestId: 0,
		type: '',
	};
	currentFile.fileURL = fileReader.result;

	if (activityId) {
		currentFile.activityId = activityId;
	}

	if (budgetId) {
		currentFile.budgetId = budgetId;
	}

	if (mdfRequestId) {
		currentFile.mdfRequestId = mdfRequestId;
	}

	if (typeDocument) {
		currentFile.type = typeDocument;
	}

	if (setFieldValue) {
		setFieldValue(`${name}`, currentFile);
	}
}
