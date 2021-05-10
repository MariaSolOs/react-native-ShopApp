import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';

interface Props extends ViewProps {
    children: React.ReactNode;
}

const CenteredView = (props: Props) => {
    return (
        <View style={[styles.centered, props.style]}>
            { props.children }
        </View>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default CenteredView;