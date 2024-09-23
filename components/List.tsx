import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

// Define the shape of an item
interface Item {
  id: number;
  name: string;
  checked: boolean;
}

// Define the shape of the component's state
interface State {
  Items: Item[];
  newItem: string;
  editingName: string;
  editItemId: number | null;
}

export class List extends Component<{}, State> {
  state: State = {
    Items: [],
    newItem: "",
    editingName: "",
    editItemId: null,
  };

  // Add a new item to the list
  addItem = () => {
    if (!this.state.newItem.trim()) {
      return;
    }

    const newItems = [
      ...this.state.Items,
      {
        id: Date.now(),
        name: this.state.newItem.trim(),
        checked: false,
      },
    ];

    this.setState({
      Items: newItems,
      newItem: "", // Clear the input after adding
    });
  };

  // Toggle the checked state of a item
  toggleItem = (id: number) => {
    const newItems = this.state.Items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    this.setState({ Items: newItems });
  };

  // Clear all checked items from the list
  clearCheckedItems = () => {
    Alert.alert("Clear Checked Items", "Are you sure?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          const newItems = this.state.Items.filter((item) => !item.checked);
          this.setState({ Items: newItems });
        },
      },
    ]);
  };

  // Start editing an item
  startEditingItem = (id: number, name: string) => {
    this.setState({ editItemId: id, editingName: name });
  };

  // Save the edited item
  saveEditedItem = () => {
    if (!this.state.editingName.trim()) {
      return;
    }

    const newItems = this.state.Items.map((item) =>
      item.id === this.state.editItemId
        ? { ...item, name: this.state.editingName.trim() }
        : item
    );

    this.setState({
      Items: newItems,
      editItemId: null,
      editingName: "",
    });
  };

  // Render each item
  renderItem = ({ item }: { item: Item }) => (
    <>
      {this.state.editItemId === item.id ? (
        <TextInput
          style={styles.editInput}
          value={this.state.editingName}
          onChangeText={(text) => this.setState({ editingName: text })}
          autoFocus
          onBlur={this.saveEditedItem}
          onSubmitEditing={this.saveEditedItem}
        />
      ) : (
        <BouncyCheckbox
          isChecked={item.checked}
          text={item.name}
          onPress={() => this.toggleItem(item.id)}
          iconStyle={{ borderColor: "#ccc" }}
          onLongPress={() => this.startEditingItem(item.id, item.name)}
          style={styles.Item}
        />
      )}
    </>
  );

  render() {
    return (
      <View style={styles.container}>
        {/* Moved the TextInput to the top */}
        <TextInput
          style={styles.input}
          placeholder="Enter new item"
          value={this.state.newItem || ""}
          onChangeText={(text) => this.setState({ newItem: text })}
          onSubmitEditing={this.addItem}
        />

        {/* The list of items */}
        <FlatList
          data={this.state.Items}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />

        {/* The clear button remains at the bottom */}
        <TouchableOpacity
          onPress={this.clearCheckedItems}
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>Clear Checked Items</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    width: "100%",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  Item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 5,
  },
  editInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    height: 57,
  },
  clearButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default List;
