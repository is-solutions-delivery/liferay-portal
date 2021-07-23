export const useLiferayState = () => {
  const writeAtom = (atom, value) => {
    try {
      // eslint-disable-next-line no-undef
      Liferay.State.writeAtom(atom, { data: value });
    } catch (error) {
      console.warn(error);
    }
  };

  return { writeAtom };
};
