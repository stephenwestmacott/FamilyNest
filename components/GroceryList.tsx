import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  SectionList,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Swipeable } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface GroceryItem {
  id: number;
  name: string;
  checked: boolean;
  category: string;
}

interface State {
  groceryItems: GroceryItem[];
  newItem: string;
  editingName: string;
  editItemId: number | null;
  categories: string[];
  newCategory: string;
  isModalVisible: boolean;
}

export class GroceryList extends Component<{}, State> {
  state: State = {
    groceryItems: [],
    newItem: "",
    editingName: "",
    editItemId: null,
    categories: ["General"],
    newCategory: "",
    isModalVisible: false,
  };

  addGroceryItem = (category: string) => {
    if (!this.state.newItem.trim()) {
      return;
    }

    const newGroceryItems = [
      ...this.state.groceryItems,
      {
        id: Date.now(),
        name: this.state.newItem.trim(),
        checked: false,
        category,
      },
    ];
    this.setState({ groceryItems: newGroceryItems, newItem: "" });
  };

  toggleGroceryItem = (id: number) => {
    const newGroceryItems = this.state.groceryItems.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    this.setState({ groceryItems: newGroceryItems });
  };

  clearCheckedItems = () => {
    Alert.alert("Clear Checked Items", "Are you sure?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          const newGroceryItems = this.state.groceryItems.filter(
            (item) => !item.checked
          );
          this.setState({ groceryItems: newGroceryItems });
        },
      },
    ]);
  };

  startEditingItem = (id: number, name: string) => {
    this.setState({ editItemId: id, editingName: name });
  };

  saveEditedItem = () => {
    if (!this.state.editingName.trim()) {
      return;
    }

    const newGroceryItems = this.state.groceryItems.map((item) =>
      item.id === this.state.editItemId
        ? { ...item, name: this.state.editingName.trim() }
        : item
    );
    this.setState({
      groceryItems: newGroceryItems,
      editItemId: null,
      editingName: "",
    });
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      isModalVisible: !prevState.isModalVisible,
      newCategory: "",
    }));
  };

  addGroceryCategory = () => {
    if (!this.state.newCategory.trim()) {
      return;
    }

    const categories = Array.from(
      new Set([...this.state.categories, this.state.newCategory.trim()])
    );

    this.setState({ categories, newCategory: "", isModalVisible: false });
  };

  deleteCategory = (title: string) => {
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete the category "${title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => this.handleDeleteCategory(title),
        },
      ]
    );
  };

  handleDeleteCategory = (title: string) => {
    const newCategories = this.state.categories.filter(
      (category) => category !== title
    );
    const newGroceryItems = this.state.groceryItems.filter(
      (item) => item.category !== title
    );
    this.setState({
      categories: newCategories,
      groceryItems: newGroceryItems,
    });
  };

  renderGroceryItem = ({ item }: { item: GroceryItem }) => (
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
          onPress={() => this.toggleGroceryItem(item.id)}
          iconStyle={{ borderColor: "#ccc" }}
          onLongPress={() => this.startEditingItem(item.id, item.name)}
          style={styles.groceryItem}
        />
      )}
    </>
  );

  renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => this.deleteCategory(section.title)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{section.title}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new item"
          value={this.state.newItem}
          onChangeText={(text) => this.setState({ newItem: text })}
          onSubmitEditing={() => this.addGroceryItem(section.title)}
        />
      </View>
    </Swipeable>
  );

  render() {
    const {
      categories,
      groceryItems,
      isModalVisible,
      newItem,
      editItemId,
      editingName,
      newCategory,
    } = this.state;

    const groupedGroceryItems = categories.map((category) => {
      const sortedItems = groceryItems
        .filter((item) => item.category === category)
        .sort((a, b) => (a.checked === b.checked ? 0 : a.checked ? 1 : -1));

      return {
        title: category,
        data: sortedItems,
      };
    });

    return (
      <GestureHandlerRootView style={styles.root}>
        <View style={styles.container}>
          <SectionList
            sections={groupedGroceryItems}
            renderItem={this.renderGroceryItem}
            renderSectionHeader={this.renderSectionHeader}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
            contentContainerStyle={styles.listContent}
          />
          <TouchableOpacity
            onPress={this.clearCheckedItems}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Clear Checked</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.toggleModal}
            style={styles.addCategoryButton}
          >
            <Text style={styles.addCategoryButtonText}>Add Category</Text>
          </TouchableOpacity>

          {/* Add Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={this.toggleModal}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Enter new category</Text>
                <TextInput
                  style={styles.modalInput}
                  value={newCategory}
                  onChangeText={(text) => this.setState({ newCategory: text })}
                  placeholder="Category"
                />
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={this.addGroceryCategory}
                >
                  <Text style={styles.modalButtonText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={this.toggleModal}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </GestureHandlerRootView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    padding: 10,
    width: "100%",
  },
  input: {
    flex: 1,
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
  groceryItem: {
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
  },
  editInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 15,
    marginBottom: 10,
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
    height: 57,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f4f4f4",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
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
  addCategoryButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  addCategoryButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
  modalInput: {
    height: 40,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
  modalButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default GroceryList;
