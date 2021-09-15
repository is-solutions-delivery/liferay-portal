import {useState, useEffect} from 'react';
import {useFormContext} from 'react-hook-form';
import {LiferayService} from '../services/liferay';
import {useStepWizard} from './useStepWizard';
import Cookies from 'js-cookie';
import {verifyInputAgentPage} from '../utils/contact-agent';
import {useTriggerContext} from './useTriggerContext';
import {smoothScroll} from '../utils/scroll';

const liferaySiteName = LiferayService.getLiferaySiteName();

/**
 *
 * @param {String} form <useWatch>
 * @param {String?} previousSection
 * @param {String?} nextSection
 * @param {String?} errorMessage
 * @returns
 */

const useFormActions = (form, previousSection, nextSection, errorMessage) => {
	const [applicationId, setApplicationId] = useState();
	const {setError, setValue} = useFormContext();
	const {setSection} = useStepWizard();
	const {updateState} = useTriggerContext();

	/**
	 * @description When the application is created, we set the value to Form Context
	 * We tried to use setValue directly on goToPrevious and goToNextForm
	 * and for reasons unknowns, the section is not called.
	 */

	useEffect(() => {
		if (applicationId) {
			setValue('basics.applicationId', applicationId);

			Cookies.set('raylife-application-id', applicationId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [applicationId]);

	useEffect(() => {
		Cookies.set('raylife-application-form', JSON.stringify(form));
	}, [form]);

	const _onValidation = () => {
		const phraseAgentPage = verifyInputAgentPage(form, nextSection);
		let validated = true;

		if (phraseAgentPage) {
			Cookies.set('raylife-contextual-message', phraseAgentPage);
			window.location.href = `${liferaySiteName}/get-in-touch`;
			validated = false;
		} else {
			Cookies.remove('raylife-contextual-message');
		}

		return validated;
	};

	const _SaveData = async () => {
		setError('continueButton', {});
		try {
			const response = await LiferayService.createOrUpdateRaylifeApplication(
				form
			);

			setApplicationId(response.data.id);

			return response;
		} catch (error) {
			setError('continueButton', {
				message:
					errorMessage ||
					'There was an error processing your request. Please try again.',
				type: 'manual',
			});
			throw error;
		}
	};

	const onPrevious = async () => {
		await _SaveData();

		if (previousSection) {
			setSection(previousSection);
		}

		updateState('');

		smoothScroll();
	};

	const onSave = async () => {
		await _SaveData();

		window.location.href = liferaySiteName;
	};

	/**
	 * @state disabled for now
	 * @param {*} data
	 */
	const onNext = async () => {
		await _SaveData();

		const validated = _onValidation();

		if (validated) {
			if (nextSection) {
				smoothScroll();

				return setSection(nextSection);
			}

			window.location.href = `${liferaySiteName}/hang-tight`;
		}
	};

	return {onNext, onPrevious, onSave};
};

export default useFormActions;
