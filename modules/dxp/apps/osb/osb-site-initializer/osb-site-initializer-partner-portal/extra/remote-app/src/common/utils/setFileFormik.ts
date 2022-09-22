/* The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

const getFileReader = (file: any) => {
	return new Promise<{result: unknown}>((resolve, reject) => {
		const fileReader: any = new FileReader();

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
	idActivity?: number,
	idBudget?: number,
	idMdfRequest?: number,
	setFieldValue?: (
		field: string,
		value: any,
		shouldValidate?: boolean | undefined
	) => void,
	typeDocument?: string
) {
	const fileReader = await getFileReader(file[0]);

	const currentFile = {
		fileURL: file,
		idActivity: 0,
		idBudget: 0,
		idMdfRequest: 0,
		type: '',
	};
	currentFile.fileURL = fileReader.result;

	if (idActivity) {
		currentFile.idActivity = idActivity;
	}

	if (idBudget) {
		currentFile.idBudget = idBudget;
	}

	if (idMdfRequest) {
		currentFile.idMdfRequest = idMdfRequest;
	}

	if (typeDocument) {
		currentFile.type = typeDocument;
	}

	if (setFieldValue) {
		setFieldValue(`${name}`, currentFile);
	}
}
