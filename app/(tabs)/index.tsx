import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useEffect, useState } from "react";
import {
  Button,
  Text,
  Image,
  StyleSheet,
  Platform,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Clipboard,
  Keyboard,
} from "react-native";
import { OtplessHeadlessModule } from "otpless-react-native";

export default function HomeScreen() {
  const headlessModule = new OtplessHeadlessModule();
  const [result, setResult] = useState("Result view");
  const [form, setForm] = useState({
    phoneNumber: "",
    countryCode: "",
    otp: "",
    channelType: "",
    email: "",
    otpLength: "",
    expiry: "",
    deliveryChannel: "",
  });

  useEffect(() => {
    headlessModule.initHeadless("ALP5OU9SMLB3NSPYGNSG");
    headlessModule.setHeadlessCallback(onHeadlessResult);
    return () => {
      headlessModule.clearListener();
    };
  }, []);

  const handleChange = (fieldName: string, value: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      [fieldName]: value,
    }));
  };

  const startHeadless = () => {
    let headlessRequest: any = {};
    const {
      phoneNumber,
      countryCode,
      otp,
      channelType,
      expiry,
      otpLength,
      deliveryChannel,
    } = form;
    if (phoneNumber) {
      headlessRequest = {
        phone: phoneNumber,
        countryCode: countryCode,
        otp: otp,
        expiry: expiry,
        otpLength: otpLength,
        deliveryChannel: deliveryChannel,
      };
    } else {
      headlessRequest = { channelType };
    }
    headlessModule.startHeadless(headlessRequest);
  };

  const onHeadlessResult = (data: any) => {
    const dataStr = JSON.stringify(data);
    setResult(dataStr);
  };

  const copyToClipboard = () => {
    Clipboard.setString(result);
    // alert("Result copied to clipboard!");
  };

  const showPhoneHintLib = async () => {
    headlessModule.showPhoneHint(false, (response: any) => {
      console.log("Phone hint result:", response);
      if (response.phoneNumber) {
        const phoneNumber = response.phoneNumber;
        const countryCode = phoneNumber.substring(0, 3);
        const numberWithoutCountryCode = phoneNumber.substring(3);

        setForm((prevForm) => ({
          ...prevForm,
          phoneNumber: numberWithoutCountryCode.trim(),
          countryCode: countryCode.trim(),
          result: "Result:",
        }));
      } else if (response.error) {
        setResult(response.error);
      }
    });
  };

  return (
    <ScrollView>
      <TextInput
        style={[styles.input, { flex: 1 }]}
        placeholder="Phone Number"
        placeholderTextColor="#999"
        value={form.phoneNumber}
        onChangeText={(text) => handleChange("phoneNumber", text)}
        keyboardType="phone-pad"
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Country Code"
          placeholderTextColor="#999"
          value={form.countryCode}
          onChangeText={(text) => handleChange("countryCode", text)}
          keyboardType="phone-pad"
        />

        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="OTP Length"
          placeholderTextColor="#999"
          value={form.otpLength}
          onChangeText={(text) => handleChange("otpLength", text)}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Expiry"
          placeholderTextColor="#999"
          value={form.expiry}
          onChangeText={(text) => handleChange("expiry", text)}
          keyboardType="numeric"
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter email"
        placeholderTextColor="#999"
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        placeholderTextColor="#999"
        value={form.otp}
        onChangeText={(text) => handleChange("otp", text)}
        keyboardType="phone-pad"
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Enter SSO Channel"
          placeholderTextColor="#999"
          value={form.channelType}
          onChangeText={(text) =>
            handleChange("channelType", text.toUpperCase())
          }
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Delivery Channel"
          placeholderTextColor="#999"
          value={form.deliveryChannel}
          onChangeText={(text) =>
            handleChange("deliveryChannel", text.toUpperCase())
          }
        />
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={startHeadless}>
        <Text style={styles.buttonText}>Start Headless</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryButton} onPress={showPhoneHintLib}>
        <Text style={styles.buttonText}>Show phone hint lib</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryButton} onPress={copyToClipboard}>
        <Text style={styles.buttonText}>Copy Result</Text>
      </TouchableOpacity>

      <Text style={styles.resultText}>{result}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#000000",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  primaryButton: {
    marginVertical: 10,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 30,
    justifyContent: "center",
    marginHorizontal: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultText: {
    marginTop: 20,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    maxWidth: 400,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
});
