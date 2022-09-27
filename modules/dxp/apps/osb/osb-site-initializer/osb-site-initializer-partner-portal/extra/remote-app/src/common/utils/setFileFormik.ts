/* The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

const getFileReader = (file: Blob) => {
	return new Promise<{result: unknown}>((resolve, reject) => {
		const fileReader: FileReader = new FileReader();

		fileReader.readAsDataURL(file);

		fileReader.onload = () => {
			resolve(fileReader);
		};

		fileReader.onerror = reject;
	});
};

interface IProps {
	file: any;
	name: string;
	activityId?: number;
	budgetId?: number;
	mdfRequestId?: number;
	setFieldValue?: (
		field: string,
		value: any,
		shouldValidate?: boolean | undefined
	) => void;
	typeDocument?: string;
}

export default async function setFileFormik(valuesFile: IProps) {
	const fileReader = await getFileReader(valuesFile.file[0]);

	const currentFile = {
		activityId: valuesFile.activityId ?? 0,
		budgetId: valuesFile.budgetId ?? 0,
		fileURL: fileReader.result ?? valuesFile.file,
		mdfRequestId: valuesFile.mdfRequestId ?? 0,
		type: valuesFile.typeDocument ?? '',
	};

	if (valuesFile.setFieldValue) {
		valuesFile.setFieldValue(`${valuesFile.name}`, currentFile);
	}
}
