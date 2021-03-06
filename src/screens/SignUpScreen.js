import React, { useEffect, useState, useContext } from "react";
import { validateAll } from "indicative/validator";
import { View, Text,  StyleSheet } from "react-native";
import {
  Input,
  Card,
  FormValidationMessage,
  Button,
  CheckBox
} from "react-native-elements";

import { AuthContext } from "../../context";
import Firebase from "../config/firebase/firebase";

const SignUpScreen = ({ navigation }) => {
  const [emailAddress, setemailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [SignUpErrors, setSignUpErrors] = useState({});
  const [isAdmin, setAdmin] = useState(false);

  const { signUp, signIn } = useContext(AuthContext); // should be signUp

  const handleSignUp = () => {
    // https://indicative.adonisjs.com
    const rules = {
      email: "required|email",
      password: "required|string|min:6|max:40|confirmed",
    };

    const data = {
      email: emailAddress,
      password: password,
      password_confirmation: passwordConfirm,
      isAdmin: isAdmin
    };

    const messages = {
      required: (field) => `${field} is required`,
      "username.alpha": "Username contains unallowed characters",
      "email.email": "Please enter a valid email address",
      "password.min":
        "Password is too short. Must be greater than 6 characters",
      "password.confirmed": "Passwords do not match",
    };

    validateAll(data, rules, messages)
      .then(() => {
        console.log("success sign in");
        signUp({ emailAddress, password, isAdmin });
      })
      .catch((err) => {
        const formatError = {};
        err.forEach((err) => {
          formatError[err.field] = err.message;
        });
        setSignUpErrors(formatError);
      });
  };

  useEffect(() => {}, [SignUpErrors]);

  return (
    <View style={{ paddingVertical: 20 }}>
      <Card>
        <Input
          label={"Email"}
          placeholder="Email address..."
          value={emailAddress}
          onChangeText={setemailAddress}
          errorStyle={{ color: "red" }}
          errorMessage={SignUpErrors ? SignUpErrors.email : null}
        />
        <Input
          label={"Password"}
          placeholder="Password.."
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Input
          label={"Password Confirm"}
          placeholder="Enter password again"
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          secureTextEntry
        />
       
        <Text style={{ color: "red", marginLeft: 10, fontSize: 10 }}>
          {SignUpErrors ? SignUpErrors.password : null}
        </Text>
        <View style={styles.checkboxContainer}>
          <CheckBox
            checked={isAdmin}
            onPress={() => setAdmin(!isAdmin)}
            style={styles.checkbox}
          />
        <Text style={styles.label}>Admin?</Text>
        </View>

        <Button
          buttonStyle={{ margin: 10, marginTop: 50 }}
          backgroundColor="#03A9F4"
          title="SIGN UP"
          onPress={() => handleSignUp()}
        />
        <Text
          style={{ marginLeft: 80 }}
          onPress={() => navigation.navigate("Signin")}
        >
          Already Signed Up? Sign In
        </Text>
      </Card>
    </View>
  );
};
const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
});
export default SignUpScreen;
