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

// Define the shape of a grocery item
interface GroceryItem {
  id: number;
  name: string;
  checked: boolean;
  category: string;
}

// Define the shape of the component's state
interface State {
  groceryItems: GroceryItem[];
  newItem: { [key: string]: string }; // Use an object to store text input for each category
  editingName: string;
  editItemId: number | null;
  categories: string[];
  newCategory: string;
  isModalVisible: boolean;
}

export class GroceryList extends Component<{}, State> {
  state: State = {
    groceryItems: [],
    newItem: {}, // Initialize as an empty object
    editingName: "",
    editItemId: null,
    categories: ["General"],
    newCategory: "",
    isModalVisible: false,
  };

  // Add a new grocery item to the list
  addGroceryItem = (category: string) => {
    if (!this.state.newItem[category]?.trim()) {
      // Check the specific category's input
      return;
    }

    const newGroceryItems = [
      ...this.state.groceryItems,
      {
        id: Date.now(),
        name: this.state.newItem[category]?.trim(),
        checked: false,
        category,
      },
    ];
    this.setState((prevState) => ({
      groceryItems: newGroceryItems,
      newItem: { ...prevState.newItem, [category]: "" }, // Clear the specific category's input
    }));
  };

  // Toggle the checked state of a grocery item
  toggleGroceryItem = (id: number) => {
    const newGroceryItems = this.state.groceryItems.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    this.setState({ groceryItems: newGroceryItems });
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
          const newGroceryItems = this.state.groceryItems.filter(
            (item) => !item.checked
          );
          this.setState({ groceryItems: newGroceryItems });
        },
      },
    ]);
  };

  // Start editing a grocery item
  startEditingItem = (id: number, name: string) => {
    this.setState({ editItemId: id, editingName: name });
  };

  // Save the edited grocery item
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

  // Toggle the visibility of the modal to add a new category
  toggleModal = () => {
    this.setState((prevState) => ({
      isModalVisible: !prevState.isModalVisible,
      newCategory: "",
    }));
  };

  // Add a new category to the list
  addGroceryCategory = () => {
    if (!this.state.newCategory.trim()) {
      return;
    }

    const categories = Array.from(
      new Set([...this.state.categories, this.state.newCategory.trim()])
    );

    this.setState({ categories, newCategory: "", isModalVisible: false });
  };

  // Prompt to delete a category
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

  // Delete a category
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

  // Render each grocery item
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

  // Render the section headers for each category
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
          value={this.state.newItem[section.title] || ""} // Use the specific category's input
          onChangeText={(text) =>
            this.setState((prevState) => ({
              newItem: { ...prevState.newItem, [section.title]: text }, // Update the specific category's input
            }))
          }
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
      newCategory,
      editItemId,
      editingName,
    } = this.state;

    // Group grocery items by category and sort them
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

          {/* Modal for adding a new category */}
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
  // Styles for the main view
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

  // Styles for the grocery items
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

  // Styles for the section headers
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f4f4f4",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
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

  // Styles for the clear and add category buttons
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

  // Styles for the modal
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
