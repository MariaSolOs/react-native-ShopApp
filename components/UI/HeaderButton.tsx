import React from 'react';
import { Platform } from 'react-native';
import { HeaderButton as HDButton, HeaderButtonProps } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/colors';

const HeaderButton = (props: HeaderButtonProps) => (
    <HDButton 
    { ...props }
    iconSize={25}
    IconComponent={Ionicons}
    color={Platform.OS === 'android' ? '#FFF' : Colors.Primary} />
);

export default HeaderButton;