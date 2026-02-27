import { LoginSignupModal } from './login_signup/LoginSignupModal';
import { NotesContainer } from './notes_containers/NotesContainer';
import { TailSpin } from 'react-loader-spinner';
import { selectCurrentNotesContainer, selectAppStateIsLoading } from '../selectors/appStateSelectors';
import { selectUserIsAuthenticated } from '../selectors/userSelectors';
import { useAppSelector } from '../store';
import { Container, Div } from '../styles/GlobalStyles';
import { LoginSignupCell, NotesContainerTitle } from '../styles/NotesStyles';

export const Home = ({
  closeLoginSignupModal = () => { },
  isLoginSignupModalOpen = false,
  openLoginSignupModal = () => { },
}: {
  closeLoginSignupModal?: () => void;
  isLoginSignupModalOpen?: boolean;
  openLoginSignupModal?: () => void;
}) => {
  const currentNotesContainer = useAppSelector(selectCurrentNotesContainer);
  const isAuthenticated = useAppSelector(selectUserIsAuthenticated);
  const isLoadingNotesContainers = useAppSelector(selectAppStateIsLoading);

  return isAuthenticated ? (
    isLoadingNotesContainers ? (
      <Container>
        <Div $d="column" $f="1.2rem" $m="40px 0 0 0">
          <span style={{ paddingBottom: '38px' }}>Fetching Notes Containers...</span>
          <TailSpin color="#00BFFF" height={70} width={70} />
        </Div>
      </Container>
    ) : (
      !!currentNotesContainer && <NotesContainer notesContainer={currentNotesContainer} />
    )
  ) : (
    <Container>
      {isLoginSignupModalOpen && (
        <LoginSignupModal
          closeLoginSignupModal={closeLoginSignupModal}
          isLoginSignupModalOpen={isLoginSignupModalOpen}
        />
      )}
      <LoginSignupCell onClick={() => openLoginSignupModal()}>
        <NotesContainerTitle>Log In or Sign Up to view or create Nested Notes Containers.</NotesContainerTitle>
      </LoginSignupCell>
    </Container>
  );
};