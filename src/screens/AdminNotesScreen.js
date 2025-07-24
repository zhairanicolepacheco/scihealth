"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Dimensions,
  Image,
  ScrollView,
} from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { firestore } from "../firebase/config"
import { formatDate } from "../components/functions"
import { habits, moods, symptoms } from "../components/constants"
import { useRoute, useNavigation } from "@react-navigation/native"

const windowWidth = Dimensions.get("window").width

export default function AdminNotesScreen() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [activeNote, setActiveNote] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredNotes, setFilteredNotes] = useState([])
  const [name, setName] = useState("")

  const route = useRoute()
  const navigation = useNavigation()
  const { userId } = route.params

  useEffect(() => {
    if (!userId) return

    const fetchUserData = async () => {
      try {
        const userDoc = await firestore().collection("users").doc(userId).get()
        if (userDoc.exists) {
          setName(userDoc.data().name || "User")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()

    const unsubscribe = firestore()
      .collection("notes")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .onSnapshot(
        (snapshot) => {
          const notesList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          setNotes(notesList)
          setLoading(false)
        },
        (error) => {
          console.error("Error fetching notes:", error)
          setLoading(false)
        },
      )

    return () => unsubscribe()
  }, [userId])

  useEffect(() => {
    const filtered = notes.filter(
      (note) =>
        note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredNotes(filtered)
  }, [notes, searchQuery])

  const openNoteModal = (note = null) => {
    setActiveNote(note)
    setModalVisible(true)
  }

  const renderNote = ({ item }) => (
    <TouchableOpacity
      style={[styles.noteCard, item.mood && styles.noteCardWithMood]}
      onPress={() => openNoteModal(item)}
    >
      <View style={styles.noteCardInner}>
        <View style={styles.noteCardContent}>
          <View style={styles.titleRow}>
            <Text style={styles.noteTitle} numberOfLines={1}>
              {item.title || ""}
            </Text>
            {item.mood && (
              <Image 
                source={moods.find((m) => m.id === item.mood)?.color} 
                style={styles.noteMoodIcon} 
              />
            )}
          </View>
          <Text style={styles.noteText} numberOfLines={3}>
            {item.content}
          </Text>
        </View>
        <View style={styles.noteFooter}>
          <Text style={styles.noteDate}>
            {formatDate(item.updatedAt?.toDate() || item.createdAt?.toDate(), true)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#196EB0" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection:'row', alignItems:'center', marginBottom: 16 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#196EB0" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{name}'s Notes</Text>
        </View>

        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredNotes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.notesList}
        ListEmptyComponent={<Text style={styles.emptyText}>No notes found</Text>}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false)
          setActiveNote(null)
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderContent}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false)
                  setActiveNote(null)
                }}
                style={styles.modalButton}
              >
                <Icon name="chevron-back" size={24} color="#333" />
                <Text style={styles.modalButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.modalContent}>
            {activeNote && (
              <>
                <View style={styles.noteSection}>
                  <Text style={styles.titleInput}>{activeNote.title || "Untitled"}</Text>
                  <ScrollView style={styles.contentInputContainer}>
                    <Text style={styles.contentInput}>{activeNote.content}</Text>
                  </ScrollView>
                </View>

                <View style={styles.separator} />

                <View style={styles.moodSection}>
                  <Text style={styles.sectionTitle}>Mood</Text>
                  <View style={styles.iconGrid}>
                    {moods.map((item) => (
                      <View key={item.id} style={styles.iconContainer}>
                        <Image
                          source={activeNote.mood === item.id ? item.color : item.outline}
                          style={styles.icon}
                        />
                        <Text style={styles.iconText}>{item.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.separator} />

                <View style={styles.habitsSection}>
                  <Text style={styles.sectionTitle}>Habits</Text>
                  <View style={styles.iconGrid}>
                    {habits.map((item) => (
                      <View key={item.id} style={styles.iconContainer}>
                        <Image
                          source={activeNote.habits?.includes(item.id) ? item.color : item.outline}
                          style={styles.icon}
                        />
                        <Text style={styles.iconText}>{item.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.separator} />

                <View style={styles.symptomsSection}>
                  <Text style={styles.sectionTitle}>Symptoms</Text>
                  <View style={styles.iconGrid}>
                    {symptoms.map((item) => (
                      <View key={item.id} style={styles.iconContainer}>
                        <Image
                          source={activeNote.symptoms?.includes(item.id) ? item.color : item.outline}
                          style={styles.icon}
                        />
                        <Text style={styles.iconText}>{item.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#196EB0",
    flex: 1
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  notesList: {
    padding: 12,
  },
  row: {
    justifyContent: "space-between",
  },
  noteCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: '100%',
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  noteCardInner: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  noteCardWithMood: {
    paddingTop: 0,
  },
  noteCardHeader: {
    height: 4,
    backgroundColor: '#E8F3FF',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteMoodIcon: {
    width: 24,
    height: 24,
  },
  noteCardContent: {
    padding: 16,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  noteText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  noteFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 12,
  },
  noteDate: {
    fontSize: 10, 
    color: "#999",
    fontStyle: "italic", 
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingTop: 20,
  },
  modalHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 17,
    color: "#196EB0",
    fontWeight: "500",
  },
  modalContent: {
    flex: 1,
  },
  noteSection: {
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  titleInput: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  contentInputContainer: {
    minHeight: 250,
    maxHeight: 250,
    marginBottom: 16,
  },
  contentInput: {
    fontSize: 14,
    color: "#333",
    lineHeight: 24,
  },
  separator: {
    height: 2,
    backgroundColor: "#F5F5F5",
  },
  moodSection: {
    padding: 15,
    backgroundColor: "#FFFFFF",
  },
  habitsSection: {
    padding: 15,
    backgroundColor: "#FFFFFF",
  },
  symptomsSection: {
    padding: 15,
    backgroundColor: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
    alignItems: "center",
    justifyContent: "center"
  },
  iconContainer: {
    width: (windowWidth - 64) / 5,
    alignItems: "center",
    padding: 8,
    marginBottom: 8,
  },
  icon: {
    width: 30,
    height: 30,
    marginBottom: 4,
  },
  iconText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
})