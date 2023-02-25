/* eslint-disable prettier/prettier */
import { Outlet } from 'react-router-dom';
// material
//
import MainNavbar from './MainNavbar';
import BottomMobileMenu from './BottomMobileMenu';
import useSettings from '../../hooks/useSettings';

// ----------------------------------------------------------------------

export default function MainLayout(props) {
  const { themeMode } = useSettings();
  return (
    <div id={themeMode} style={{ paddingBottom: '70px'}}>
      <MainNavbar peraWallet={props.peraWallet} />
      <div>
        <Outlet />
      </div>
      <BottomMobileMenu />
    </div>
  );
}
