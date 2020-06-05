import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, FlatList, Alert } from "react-native";
import { Card, FAB } from "react-native-paper";

const Home = (props) => {
  const [data, setData] = useState([]);
  const [loading, setloading] = useState(true);

  const fetchData = () => {
    fetch("https://server-empapp.herokuapp.com/")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setloading(false);
      })
      .catch((err) => {
        Alert.alert("someting went wrong");
      });
  };

  useEffect(() => {
    fetchData();
  });

  const renderList = (item) => {
    return (
      <Card
        style={styles.mycard}
        key={item.id}
        onPress={() => props.navigation.navigate("Profile", { item })}
      >
        <View style={styles.cardview}>
          <Image style={styles.cardimage} source={{ uri: item.picture }} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.text}>{item.name}</Text>
            <Text>{item.position}</Text>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <View style={{ marginTop: 5, flex: 1 }}>
      <FlatList
        data={data}
        renderItem={({ item }) => {
          return renderList(item);
        }}
        keyExtractor={(item) => {
          item.id;
        }}
        onRefresh={() => fetchData()}
        refreshing={loading}
      />

      <FAB
        onPress={() => props.navigation.navigate("Create")}
        style={styles.fab}
        small={false}
        theme={{ colors: { accent: "#006aff" } }}
        icon="plus"
      />
    </View>
  );
};
const styles = StyleSheet.create({
  mycard: {
    margin: 5,
    padding: 10,
  },
  cardview: {
    flexDirection: "row",
    padding: 3,
  },
  text: {
    fontSize: 20,
  },
  cardimage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
export default Home;
