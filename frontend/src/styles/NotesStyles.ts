import { colors, NAV_HEIGHT } from '../constants';
import { Divider, StyledLink } from './GlobalStyles';
import { Nav } from './NavbarStyles';
import styled from 'styled-components';

export const EmptyNotesContainerImage = styled.div`
  height: 148px;
  margin-top: 5px;
  width: 148px;
`;

export const NotesContainerCell = styled.div`
  align-items: center;
  border: 8px solid ${colors.NAVY};
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 12px 12px 4px 12px;
  transition: 0.4s;

  :hover {
    border: 8px solid ${colors.LIGHT_NAVY};
    color: ${colors.LIGHT_GREY};
    cursor: pointer;
  }

  @media (max-width: 480px) {
    height: 240px;
    width: 240px;
  }
  @media (min-width: 480px) and (max-width: 1000px) {
    height: 300px;
    width: 300px;
  }
  @media (min-width: 1000px) {
    height: 350px;
    width: 350px;
  }
`;

export const EditNotesContainerCell = styled(NotesContainerCell) <{
  $isActive?: boolean;
}>`
  height: auto;
  opacity: ${({ $isActive }) => `${!!$isActive ? '0.5' : '1'}`};

  :hover {
    border: 8px solid ${colors.NAVY};
    color: ${colors.GREY};
    cursor: auto;
  }
`;

export const EditNotesContainerImage = styled.img`
  height: 148px;
  margin-top: 5px;
  width: 148px;
`;

export const InnerNoteDiv = styled.div<{
  $isActive?: boolean;
}>`
  display: flex;
  flex-direction: column;
  opacity: ${({ $isActive }) => `${!!$isActive ? '0.5' : '1'}`};
  padding: 0 5px;
  width: 100%;
`;

export const LoginSignupCell = styled(NotesContainerCell)`
  margin-top: 1%;

  @media (max-width: 480px) {
    margin-top: 10%;
  }
`;

export const NewNotesContainerCell = styled(NotesContainerCell)`
  height: auto;

  :hover {
    border: 8px solid ${colors.NAVY};
    color: ${colors.GREY};
    cursor: auto;
  }

  @media (max-width: 480px) {
    width: 290px;
  }
  @media (min-width: 480px) and (max-width: 1000px) {
    width: 350px;
  }
  @media (min-width: 1000px) {
    width: 412px;
  }
`;

export const NoteDiv = styled.div<{
  $isInitialized: boolean;
}>`
  align-items: center;
  border: ${({ $isInitialized }) => `${$isInitialized ? '4px solid #0e052a' : 'none'}`};
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
  padding: 6px;
  width: 100%;
`;

export const NotesListContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 74%;
`;

export const NotesContainerImage = styled.img`
  height: 65%;
  margin-top: 20px;
  width: 65%;
`;

export const NotesContainerImageText = styled.a`
  color: ${colors.DARK_GREY};
  cursor: pointer;
  font-size: 0.8rem;
  margin: 0 8px;
  text-decoration: none;
  transtion: 0.4s;

  :hover {
    color: ${colors.SLIGHTLY_LESS_DARK_GREY};
  }
`;

export const NotesContainerNav = styled(Nav)`
  background-color: black;
  border-bottom: 2px solid ${colors.NAVY};
  height: auto;
  justify-content: center;
  position: sticky;
  top: ${NAV_HEIGHT}px;
`;

export const NotesContainerNavDivider = styled(Divider)`
  color: ${colors.DARK_GREY};
  font-size: 0.9rem;
  font-weight: 400;
  padding: 0 10px;
  transform: scaleY(1.6);
`;

export const NotesContainerNavLink = styled(StyledLink) <{
  $isSelected: boolean;
}>`
  border-bottom: ${({ $isSelected }) => `1px solid ${$isSelected ? colors.LIGHTER_NAVY : 'black'}`};
  color: ${colors.DARK_GREY};
  font-size: 1.1rem;
  padding: 1px 3px;
  transition: 0.4s;

  :hover {
    color: ${colors.SLIGHTLY_DARKER_GREY};
  }
`;

export const NotesContainerNavTitle = styled.div`
  font-size: 1.4rem;
`;

export const NotesContainerNavTitleDiv = styled.div`
  color: ${colors.LIGHT_GREY};
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 6px;
  max-height: 100px;
  overflow: auto;
  width: 75%;
`;

export const NotesContainersGridContainer = styled.div`
  align-items: center;
  display: grid;
  gap: 3em;
  justify-content: center;
  justify-items: center;
  margin: 0;
  width: 85%;

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, 240px);
  }
  @media (min-width: 480px) and (max-width: 1000px) {
    grid-template-columns: repeat(auto-fit, 300px);
  }
  @media (min-width: 1000px) {
    grid-template-columns: repeat(auto-fit, 350px);
  }
`;

export const NotesContainerTitle = styled.span`
  font-size: 1.2rem;
  overflow: auto;
  text-overflow: ellipsis;
  word-wrap: break-word;

  @media (max-width: 480px) {
    font-size: 1rem;
    max-width: 190px;
    padding: 0px;
  }
  @media (min-width: 480px) and (max-width: 1000px) {
    max-width: 250px;
  }
  @media (min-width: 1000px) {
    max-width: 300px;
  }
`;