import ClayForm, { ClayInput } from '@clayui/form';

type Props = {
    inputTitle: string;
};

const InputText: React.FC<Props> = ({ inputTitle, ...props }
) => {


    return (
        <>
            <ClayForm.Group>
                <label>{inputTitle}</label>
                <ClayInput
                    {...props}
                />
            </ClayForm.Group>
        </>
    );
};

export default InputText;