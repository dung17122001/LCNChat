import { View, Text, SafeAreaView, StatusBar, Image, TextInput, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { loginSuccess, loginErorr } from '../../redux/Slice/authSlice';

import Ionicons from 'react-native-vector-icons/Ionicons';

import logo from '../../assets/logo.png';
import TextInputDN from '../../components/TextInputDN';
import Button from '../../components/Button/button';
import { loginUser, findBanAccount } from '../../services/authService';
import { connect, useDispatch, useSelector } from 'react-redux';
import QuenMatKhau from '../QuenMatKhauScreen/QuenMatKhau/quenMatKhau';

function DangNhapScreen() {
    const navigation = useNavigation();
    const [hidePass, setHidePass] = useState(true);
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [countFail, setCountFail] = useState(0);
    const [validEmail, setValidEmail] = useState('hidden');
    const [validPassword, setValidPassword] = useState('hidden');
    const [failLogin, setFailLogin] = useState('hidden');

    const dispatch = useDispatch();
    const userSelector = useSelector((state) => state.auth);
    useEffect(() => {
        if (userSelector.currentUser !== null && !!userSelector.currentUser.accessToken) {
            navigation.navigate('HomeTabBar');
        }
    }, []);

    const [data, setData] = useState(null);

    // useEffect(()=>{
    //     const getDataLogin = ()=>{
    //         var user = { userName: 'test@gmail.com', password: '123456' };
    //     }
    // },[data])

    const handleLogin = async () => {
        var valueEmail = checkValidEmail(emailValue);
        var valuePassword = checkValidPassword(passwordValue);
        const check = await findBanAccount(valueEmail);
        setFailLogin('opacity-0');
        if (!!check) {
            // setBanned('blur-sm w-screen h-screen');
            Alert.alert(
                'Th??ng b??o',
                'Hi???n email ???? b??? t???m kho?? do nh???p sai qu?? nhi???u l???n xin b???n th??? l???i sau v??i ti???ng n???a',
            );
            navigation.navigate(DangNhapScreen);
        }
        if (countFail === 10) {
            navigation.navigate(QuenMatKhau);
        }
        // console.log('L???i l???n 10');

        if (!!validEmail && !!validPassword) {
            // ????ng nh???p th??nh c??ng -->
            // console.log({ userSelector });
            var user = { userName: valueEmail, password: valuePassword };

            var login = await loginUser(user, dispatch);

            if (login) {
                //s console.log(login);
                navigation.navigate('HomeTabBar');
            }
            if (!login) {
                setFailLogin('');
            }
        } else return false;
        // // Alert.alert(emailRef);
    };

    const checkValidEmail = (dataEmail) => {
        var valueEmail = dataEmail.trim();

        if (valueEmail.length === 0 || !valueEmail.match(/^[a-zA-Z._0-9]+@[a-z]+\.[a-z]+$/)) {
            setValidEmail('opacity-1');
            return '';
        } else {
            setValidEmail('opacity-0');

            return dataEmail;
        }
    };
    const checkValidPassword = (dataPassword) => {
        var valuePassword = dataPassword.trim();

        setValidPassword('opacity-0');

        if (valuePassword.length === 0 || !valuePassword.match(/^[a-zA-Z0-9\.@ ]{6,}$/)) {
            setValidPassword('opacity-1');
            return '';
        } else {
            setValidPassword('opacity-0');
            return valuePassword;
        }
    };

    return (
        <ScrollView className="bg-white">
            <SafeAreaView
                style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
                className="bg-white"
            >
                <View className={'bg-white h-full flex justify-between'}>
                    <View className=" p-2 w-1/4">
                        <Ionicons
                            name="arrow-back"
                            size={30}
                            color="#47A9FF"
                            onPress={() => {
                                navigation.goBack();
                            }}
                        />
                    </View>
                    <View>
                        <View className={'h-15 w-full flex justify-center items-center'}>
                            <Image source={logo} />
                        </View>
                        <View className={' mt-2 mb-6 items-center justify-center'}>
                            <Text className={'text-3xl font-semibold text-lcn-blue-5'}>????ng nh???p</Text>
                        </View>
                        <View className={'p-4'}>
                            <View>
                                <Text className={'absolute z-10 text-red-500 text-sm w-full ' + failLogin}>
                                    T??n ????ng nh???p ho???c m???t kh???u kh??ng ????ng
                                </Text>
                                <Text className={'text-lg font-semibold text-lcn-blue-5 pt-3'}>Email</Text>
                            </View>
                            <TextInputDN
                                Icon={<Ionicons name="mail" size={20} color="#47A9FF" />}
                                placeholder="Nh???p email"
                                onChangeText={(emailValue) => {
                                    checkValidEmail(emailValue);
                                    setEmailValue(emailValue);
                                }}

                                // ref={emailRef}
                            ></TextInputDN>
                        </View>
                        <View className={'p-4'}>
                            <Text className={'text-lg font-semibold text-lcn-blue-5'}>Nh???p m???t kh???u</Text>
                            <TextInputDN
                                secureTextEntry={hidePass ? true : false}
                                Icon={<Ionicons name="lock-closed" size={20} color="#47A9FF" />}
                                placeholder="Nh???p m???t kh???u"
                                onChangeText={(passwordValue) => {
                                    checkValidPassword(passwordValue);
                                    setPasswordValue(passwordValue);
                                }}
                                // ref={passwordRef}
                                Icon2={
                                    hidePass ? (
                                        <Ionicons
                                            name="eye"
                                            size={20}
                                            color="#47A9FF"
                                            onPress={() => {
                                                setHidePass(!hidePass);
                                            }}
                                        />
                                    ) : (
                                        <Ionicons
                                            name="eye-off"
                                            size={20}
                                            color="#47A9FF"
                                            onPress={() => {
                                                setHidePass(!hidePass);
                                            }}
                                        />
                                    )
                                }
                            ></TextInputDN>
                            <View>
                                {/* <Text className={'absolute z-10 text-red-500 text-sm w-full pt-0 ' + validPassword}>
                                    Password kh??ng ????ng
                                </Text> */}
                            </View>
                        </View>

                        <View className={'mr-4 justify-center items-end'}>
                            <Text
                                className={'text-lcn-blue-5 font-semibold text-base'}
                                onPress={() => {
                                    navigation.navigate('QuenMatKhau');
                                }}
                            >
                                Qu??n m???t kh???u?
                            </Text>
                        </View>
                    </View>
                    <View className={'p-3 items-center justify-center'}>
                        <Button
                            classNames={'w-64 h-14 bg-lcn-blue-4 rounded-[50px] border border-white '}
                            onPress={handleLogin}
                        >
                            <Text className={'text-white font-semibold text-2xl'}>????ng nh???p</Text>
                        </Button>
                    </View>

                    <View className={' flex flex-row p-5 items-center justify-center'}>
                        <Text className={'text-lcn-blue-5 font-semibold text-base'}>B???n ch??a c?? t??i kho???n ? </Text>
                        <Text
                            className={'text-lcn-blue-4 font-semibold text-base'}
                            onPress={() => {
                                navigation.navigate('DangKyScreen');
                            }}
                        >
                            ????ng k?? ngay
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}

export default DangNhapScreen;
