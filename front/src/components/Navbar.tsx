import jwtDecode from 'jwt-decode';
import React from 'react'
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout, selectlogged, setLoginModal } from '../features/Login/loginSlice';
import { setRegisterModalView } from '../features/Register/registerSlice';


const Navbar = () => {
    const logged = useAppSelector(selectlogged)
    const accessToken = String(sessionStorage.getItem('token'))
    let decodedToken: any = null;
    if (logged) {
        decodedToken = jwtDecode<any>(String(accessToken))
    }
    const dispatch = useAppDispatch()
    return (
        <>
            {logged ?
                // WHEN LOGGED IN!
                <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top" style={{ backgroundColor: '#e3f2fd' }}>
                    <div className="container-fluid">
                        <Link to={'/'}><img src="./aero.png" alt='logo' style={{ width: '100px' }} /></Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                {/* data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" */}
                                <li className="nav-item"><Link className="nav-link active" aria-current="page" to={'/'}><span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Home</span></Link></li>
                                <li className="nav-item"><Link className="nav-link" to={'profile'}><span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">My profile</span></Link></li>
                                <li className="nav-item"><Link className="nav-link" to={'flights'}><span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Daily Schedule</span></Link></li>
                                {/* ONLY IF MANAGER */}
                                {decodedToken?.type === "Manager" &&
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" role="button" href='/#' data-bs-toggle="dropdown" aria-expanded="false">
                                            Manager Tools
                                        </a>
                                        <ul className="dropdown-menu">
                                            <Link className="dropdown-item" to={'manageProfiles'}><span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Manage Profiles</span></Link>
                                            <Link className="dropdown-item" to={'/'} onClick={() => dispatch(setRegisterModalView())}><span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Register new employee</span></Link>
                                            <Link className="dropdown-item" to={'/'}><span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">TBA</span></Link>
                                        </ul>
                                    </li>
                                }
                            </ul>
                            <ul className='navbar-nav ms-auto'>

                                <li className='nav-item'><Link className="nav-link" data-bs-toggle="collapse" to={'profile'}><span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Hi {decodedToken?.name}</span></Link></li>
                                <li className="nav-item"><Link className="nav-link" data-bs-toggle="collapse" to={'/'} onClick={() => { dispatch(logout()); }}><span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Log out</span></Link></li>
                            </ul>
                        </div>
                    </div>
                </nav>
                :
                // WHEN NOT LOGGED IN!
                <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top" style={{ backgroundColor: 'black' }}>
                    <Link to={'/'}><img src="./aero.png" alt='logo' style={{ width: '100px' }} /></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item"><Link className="nav-link active" aria-current="page" to={'/'}>Home</Link></li>
                            {/* <li className="nav-item"><Link className="nav-link" aria-current="page" to={'/'}>TBA</Link></li> */}
                        </ul>
                        <ul className='navbar-nav ms-auto'>
                            <li className="nav-item"><Link className="nav-link" aria-current="page" to={'/'} onClick={() => dispatch(setLoginModal(true))}>Login</Link></li>
                        </ul>
                    </div>
                </nav>}
        </>
    )
}

export default Navbar