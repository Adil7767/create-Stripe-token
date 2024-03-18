//import liraries
import { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Modal, TouchableOpacity, Text, Button } from 'react-native';

import { CardField ,createToken} from '@stripe/stripe-react-native';

// create a component
const PaymentScreen = () => {

    const [cardInfo, setCardInfo] = useState(null)
    const [isLoading, setLoading] = useState(false)

    const fetchCardDetail = (cardDetail) => {
        console.log("my card details",cardDetail)
        if (cardDetail.complete) {
            setCardInfo(cardDetail)
        } else {
            setCardInfo(null)
        }
    }



    const onDone = async () => {

 

     

        console.log("cardInfocardInfocardInfo", cardInfo)
        if (!!cardInfo) {
            try {
                console.log({ ...cardInfo, type: 'Card' });
                const resToken = await createToken({ ...cardInfo, type: 'Card' })
                console.log("resToken", resToken)

            } catch (error) {
                console.log(error,'error');
                alert("Error raised during create token")
            }
        }


    }





 

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ padding: 16 }}>
                    <CardField
                        postalCodeEnabled={false}
                        placeholders={{
                            number: '4242 4242 4242 4242',
                        }}

                        cardStyle={{
                            backgroundColor: '#FFFFFF',
                            textColor: '#000000',
                        }}
                        style={{
                            width: '100%',
                            height: 50,
                            marginVertical: 30,
                        }}
                        onCardChange={(cardDetails) => {
                            fetchCardDetail(cardDetails)
                        }}
                        onFocus={(focusedField) => {
                            console.log('focusField', focusedField);
                        }}

                    />

                    <TouchableOpacity
                     style={{
                        backgroundColor: 'red',
                        textColor: '#000000',
                    }}
                        onPress={onDone}
                        disabled={!cardInfo}
                    ><Text>gggggg</Text></TouchableOpacity>

                   

                   

                </View>
            </SafeAreaView>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
});

//make this component available to the app
export default PaymentScreen;