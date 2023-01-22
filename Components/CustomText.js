import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';

const CustomText = ({ caption, style }) => {
    const [showMore, setShowMore] = useState(false);
    const [showText, setShowText] = useState(false);
    const [numOfLines, setNumOfLines] = useState(undefined);

    const handleTextLayout = useCallback(
        (e) => {
            if (e.nativeEvent.lines.length > 2 && !showText) {
                setShowMore(true)
                setNumOfLines(2)
            }
        },
        [showText]
    );

    useEffect(() => {
        if (showMore) {
            setNumOfLines(showText ? undefined : 2);
        }
    }, [showText, showMore]);

    return (
        <View>
            <Text style={style} numberOfLines={numOfLines} onTextLayout={handleTextLayout}>
                {caption}
            </Text>

            {showMore ?
                <TouchableOpacity onPress={() => setShowText((showText) => !showText)}>
                    <Text style={styles.showMoreButtom}>{showText ? 'see less' : 'see more'}</Text>
                </TouchableOpacity>
                : null}
        </View>
    )
}

export default CustomText

const styles = StyleSheet.create({
    showMoreButtom: {
        color: 'grey'
    }
})