import { PrimaryStatTextButton, StatTextButtonLabel, TextUnskewWrapper } from '../../organisms/navBar/styles.ts';
import { PROTECTED_ROUTES } from '../../../types/constants.ts';

interface BalanceButtonProps {
  balance: number;
  balanceString: string;
  handleNavigate: (path: string) => void;
}

export const BalanceButton = ({ balance, balanceString, handleNavigate }: BalanceButtonProps) => {
  return (
    <>
      <PrimaryStatTextButton
        onClick={() => handleNavigate(PROTECTED_ROUTES.FINANCES)}
        $balance={balance}
        $isActiveScene={location.pathname === PROTECTED_ROUTES.FINANCES}
      >
        <TextUnskewWrapper>
          {balanceString}
        </TextUnskewWrapper>
      </PrimaryStatTextButton>
      <StatTextButtonLabel>
        FINANCES
      </StatTextButtonLabel>
    </>
  );
};
