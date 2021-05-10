import React, { useEffect, useRef } from 'react';
import { useAppSelector } from '../hooks/redux';
import { NavigationContainerComponent, NavigationActions } from 'react-navigation';

import ShopNavigator from './ShopNavigator';

const NavigationContainer = () => {
    const navRef = useRef<NavigationContainerComponent>(null);
    const isAuth = useAppSelector(state => Boolean(state.auth.token));

    useEffect(() => {
        if (!isAuth) {
            navRef.current?.dispatch(NavigationActions.navigate({
                routeName: 'Auth'
            }));
        }
    }, [isAuth]);

    return (
        <ShopNavigator ref={navRef} />
    );
}

export default NavigationContainer;