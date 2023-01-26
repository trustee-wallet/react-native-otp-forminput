import React, { useState, useRef, useEffect } from 'react'
import {
    TextInput,
    Keyboard,
    View,
    StyleSheet,
    Text,
    Image,
} from "react-native";

const OTPInput = ({
                      type = "outline",
                      defaultValue = "",
                      keyboardType = "number-pad",
                      cursorColor = "#4C5457",
                      borderColor = "#8FA2A3",
                      currentBorderColor = "#3E517A",
                      backgroundColor = "#404040",
                      currentBackgroundColor = "#3E517A",
                      numberOfInputs = 6,
                      imageUrl = null,
                      imageStyle,
                      title = null,
                      titleStyle,
                      subtitle = null,
                      subtitleStyle,
                      inputStyle,
                      secureTextEntry = false,
                      onFilledCode = false,
                      customHeader = false,
                      onChange = () => {
                      },
                      pasteValue = false
                  }) => {
    const inputRef = useRef([]);
    const [state, setState] = useState([]);
    const [indexState, setIndexState] = useState(null);

    const handleKeyPress = ({nativeEvent: {key: keyValue}}) => {
        const prevIndex = indexState - 1
        const nextIndex = indexState + 1
        const nextValue = inputRef.current[nextIndex]?._internalFiberInstanceHandleDEV?.pendingProps?.value
        const currentValue = inputRef.current[indexState]?._internalFiberInstanceHandleDEV?.pendingProps?.value
        if (keyValue === "Backspace") {
            if (indexState !== 0) {
                if (currentValue === '') {
                    setIndexState(prevIndex)
                    inputRef.current[prevIndex]?.focus()
                }
            }
        } else {
            if (indexState !== numberOfInputs - 1) {
                setIndexState(nextIndex)
                inputRef.current[nextIndex]?.focus()
                if (currentValue !== '') {
                    if (nextValue === '') {
                        const copyState = [...state]
                        copyState[nextIndex] = keyValue
                        keyboardClose(copyState)
                        setState(copyState)
                    }
                }
            } else {
                Keyboard.dismiss()
            }
        }
    }

    useEffect(() => {
        if (pasteValue) {
            const newState = pasteValue.split('')
            setState(newState)
        }
    }, [pasteValue])


    const handleChange = (e, index) => {
        if (e === " ") {

        } else if (e === "") {
            const copyState = [...state];
            copyState[index] = e;
            keyboardClose(copyState);
            setState(copyState);
        } else {
            const copyState = [...state];
            copyState[index] = e;
            keyboardClose(copyState);
            setState(copyState);
        }
    };

    const keyboardClose = (text) => {
        if (text.length > 0) {
            onChange(text.join(""));
        }
    };

    const filterData = () => {
        if (defaultValue.length === 6) {
            const copyState = defaultValue.split("");
            setState(copyState);
            setIndexState(defaultValue.length - 1);
        } else {
            const copyState = [];
            [...Array(numberOfInputs).keys()].map((data, index) => {
                copyState.push("");
            });
            setState(copyState);
        }
    };

    useEffect(() => {
        if (state.length === 0) {
            filterData();
        }
    }, [state]);

    const handleBlur = () => {
        setIndexState(false)
    }

    return (
        <View style={styles.main}>
            {imageUrl && (
                <Image
                    style={StyleSheet.flatten([
                        {
                            height: 72,
                            width: 72,
                            marginVertical: 5,
                        },
                        imageStyle,
                    ])}
                    source={{
                        uri: imageUrl,
                    }}
                />
            )}
            {title != null && (
                <Text
                    style={StyleSheet.flatten([
                        {marginVertical: 10, fontSize: 18, fontWeight: "bold"},
                        titleStyle,
                    ])}
                >
                    {title}
                </Text>
            )}
            {customHeader ?
                <View style={{width: '100%', marginBottom: 16}}>
                    {customHeader()}
                </View> : null}
            <View style={styles.textInputView}>
                {state.map((data, index) => (
                    <View key={index}>
                        <TextInput
                            placeholder=''
                            autoCorrect={false}
                            autoFocus={index === indexState}
                            maxLength={1}
                            value={data}
                            ref={(ref) => inputRef.current.push(ref)}
                            onChangeText={(e) => {
                                handleChange(e, index);
                            }}
                            onFocus={() => {
                                setIndexState(index);
                            }}
                            onBlur={handleBlur}
                            selectionColor={cursorColor}
                            keyboardType={keyboardType}
                            onKeyPress={handleKeyPress}
                            secureTextEntry={secureTextEntry}
                            style={StyleSheet.flatten([
                                inputStyle,
                                {
                                    height: 58,
                                    borderRadius: 10,
                                    textAlign: "center",
                                    borderBottomWidth:
                                        type === "filled"
                                            ? inputStyle?.borderWidth
                                                ? inputStyle.borderWidth
                                                : 1.5
                                            : 1,
                                    borderWidth:
                                        type === "outline"
                                            ? inputStyle?.borderWidth
                                                ? inputStyle.borderWidth
                                                : 1
                                            : 0,
                                    minWidth: numberOfInputs > 5 ? 46 : 50,
                                    maxWidth: numberOfInputs > 5 ? 46 : 55,
                                    borderColor:
                                        indexState === index ? currentBorderColor : borderColor,
                                    backgroundColor: backgroundColor
                                        ? indexState === index ? currentBackgroundColor : backgroundColor
                                        : type === "filled"
                                            ? "#f5f5f5"
                                            : "#fff",
                                    marginRight: numberOfInputs - 1 === index ? 0 : 8,
                                },
                            ])}
                        />
                    </View>
                ))}
            </View>
            {subtitle !== null && (
                <Text
                    style={StyleSheet.flatten([
                        {marginVertical: 10, fontSize: 13, fontWeight: "400"},
                        subtitleStyle,
                    ])}
                >
                    {subtitle}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    textInputView: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    main: {
        justifyContent: "center",
    },
});

export default OTPInput;
