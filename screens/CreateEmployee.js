import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default function CreateEmployee({ navigation, route }) {
  const getDetails = (type) => {
    if (route.params) {
      switch (type) {
        case "name":
          return route.params.name;
        case "phone":
          return route.params.phone;
        case "email":
          return route.params.email;
        case "salary":
          return route.params.salary;
        case "picture":
          return route.params.picture;
        case "position":
          return route.params.position;
      }
    }
    return "";
  };
  const [name, setName] = useState(getDetails("name"));
  const [phone, setPhone] = useState(getDetails("phone"));
  const [email, setEmail] = useState(getDetails("email"));
  const [salary, setSalary] = useState(getDetails("salary"));
  const [picture, setPicture] = useState(getDetails("picture"));
  const [position, setPosition] = useState(getDetails("position"));
  const [modal, setModal] = useState(false);
  const [enableshift, setenableShift] = useState(false);

  const submitData = () => {
    fetch("https://server-empapp.herokuapp.com/send-data", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        salary,
        picture,
        position,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        Alert.alert(`Created successfuly`);
        navigation.navigate("Home");
      })
      .catch((err) => {
        Alert.alert(`Created successfuly`);
        navigation.navigate("Home");
      });
  };

  const updateDetails = () => {
    fetch("https://server-empapp.herokuapp.com/Edit", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: route.params._id,
        name,
        email,
        phone,
        salary,
        picture,
        position,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        Alert.alert(`${data.name} is updated successfuly`);
        navigation.navigate("Home");
      })
      .catch((err) => {
        Alert.alert("someting went wrong");
      });
  };

  const picFromGallery = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (granted) {
      let data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!data.cancelled) {
        let newfile = {
          uri: data.uri,
          type: `test/${data.uri.split(".")[1]}`,
          name: `test${data.uri.split(".")[1]}`,
        };
        handleUpload(newfile);
      }
    } else {
      Alert.alert("a");
    }
  };
  const picFromCamera = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA);
    if (granted) {
      let data = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!data.cancelled) {
        let newfile = {
          uri: data.uri,
          type: `test/${data.uri.split(".")[1]}`,
          name: `test${data.uri.split(".")[1]}`,
        };
        handleUpload(newfile);
      }
    } else {
      Alert.alert("a");
    }
  };
  const handleUpload = (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "empapp");
    data.append("cloud_name", "herobotictechg");

    fetch("https://api.cloudinary.com/v1_1/herobotictechg/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setPicture(data.url);
        setModal(false);
      })
      .catch((err) => {
        Alert.alert("error while uploading");
      });
  };
  return (
    <KeyboardAvoidingView
      behavior="position"
      style={styles.root}
      enabled={enableshift}
    >
      <View>
        <TextInput
          style={styles.inputSTyle}
          label="name"
          value={name}
          onFocus={() => setenableShift(false)}
          theme={theme}
          mode="outlined"
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.inputSTyle}
          label="email"
          value={email}
          onFocus={() => setenableShift(false)}
          theme={theme}
          mode="outlined"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.inputSTyle}
          label="phone"
          value={phone}
          theme={theme}
          onFocus={() => setenableShift(false)}
          keyboardType="number-pad"
          mode="outlined"
          onChangeText={(text) => setPhone(text)}
        />
        <TextInput
          style={styles.inputSTyle}
          label="salary"
          value={salary}
          theme={theme}
          onFocus={() => setenableShift(false)}
          mode="outlined"
          onChangeText={(text) => setSalary(text)}
        />
        <TextInput
          style={styles.inputSTyle}
          label="position"
          value={position}
          theme={theme}
          onFocus={() => setenableShift(true)}
          mode="outlined"
          onChangeText={(text) => setPosition(text)}
        />
        <Button
          style={styles.inputSTyle}
          icon={picture == "" ? "upload" : "check"}
          theme={theme}
          mode="contained"
          onPress={() => setModal(true)}
        >
          Upload Image
        </Button>
        {route.params ? (
          <Button
            style={styles.inputStyle}
            icon="content-save"
            mode="contained"
            theme={theme}
            onPress={() => updateDetails()}
          >
            Update details
          </Button>
        ) : (
          <Button
            style={styles.inputStyle}
            icon="content-save"
            mode="contained"
            theme={theme}
            onPress={() => submitData()}
          >
            save
          </Button>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modal}
          onRequestClose={() => {
            setModal(false);
          }}
        >
          <View style={styles.modalview}>
            <View style={styles.modalbuttonview}>
              <Button
                icon="camera"
                mode="contained"
                theme={theme}
                onPress={() => picFromCamera()}
              >
                Camera
              </Button>
              <Button
                icon="image-area"
                mode="contained"
                theme={theme}
                onPress={() => picFromGallery()}
              >
                Gallery
              </Button>
            </View>
            <Button theme={theme} onPress={() => setModal(false)}>
              Cancel
            </Button>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}
const theme = {
  colors: {
    primary: "#006aff",
  },
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  inputSTyle: {
    margin: 5,
  },
  modalbuttonview: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  modalview: {
    position: "absolute",
    bottom: 2,
    width: "100%",
    backgroundColor: "white",
  },
});
