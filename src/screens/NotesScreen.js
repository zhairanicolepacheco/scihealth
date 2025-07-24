"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions,
  Image,
  ScrollView,
} from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { auth, firestore } from "../firebase/config"
import { formatDate } from "../components/functions"
import { habits, moods, symptoms } from "../components/constants"

const windowWidth = Dimensions.get("window").width

export default function NotesScreen() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [activeNote, setActiveNote] = useState(null)
  const [noteTitle, setNoteTitle] = useState("")
  const [noteContent, setNoteContent] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredNotes, setFilteredNotes] = useState([])
  const [selectedMood, setSelectedMood] = useState("")
  const [selectedHabits, setSelectedHabits] = useState([])
  const [selectedSymptoms, setSelectedSymptoms] = useState([])

  useEffect(() => {
    const user = auth().currentUser
    if (!user) return

    const unsubscribe = firestore()
      .collection("notes")
      .where("userId", "==", user.uid)
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
  }, [])

  useEffect(() => {
    const filtered = notes.filter(
      (note) =>
        note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredNotes(filtered)
  }, [notes, searchQuery])

  const handleSaveNote = async () => {
    if (!noteContent.trim() && !noteTitle.trim()) return

    const user = auth().currentUser
    if (!user) return

    try {
      const noteData = {
        userId: user.uid,
        title: noteTitle.trim(),
        content: noteContent.trim(),
        mood: selectedMood,
        habits: selectedHabits,
        symptoms: selectedSymptoms,
        createdAt: activeNote ? activeNote.createdAt : firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      }

      if (activeNote) {
        await firestore().collection("notes").doc(activeNote.id).update(noteData)
      } else {
        await firestore().collection("notes").add(noteData)
      }
    } catch (error) {
      console.error("Error saving note:", error)
      Alert.alert("Error", "Failed to save note")
    } finally {
      setModalVisible(false)
      resetNoteForm()
    }
  }

  const deleteNote = async (noteId) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await firestore().collection("notes").doc(noteId).delete()
          } catch (error) {
            console.error("Error deleting note:", error)
            Alert.alert("Error", "Failed to delete note")
          }
        },
        style: "destructive",
      },
    ])
  }

  const openNoteModal = (note = null) => {
    if (note) {
      setActiveNote(note)
      setNoteTitle(note.title || "")
      setNoteContent(note.content || "")
      setSelectedMood(note.mood || "")
      setSelectedHabits(note.habits || [])
      setSelectedSymptoms(note.symptoms || [])
    }
    setModalVisible(true)
  }

  const resetNoteForm = () => {
    setActiveNote(null)
    setNoteTitle("")
    setNoteContent("")
    setSelectedMood("")
    setSelectedHabits([])
    setSelectedSymptoms([])
  }

  const toggleHabit = (habitName) => {
    setSelectedHabits(prev => 
      prev.includes(habitName)
        ? prev.filter(h => h !== habitName)
        : [...prev, habitName]
    )
  }

  const toggleSymptom = (symptomName) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomName)
        ? prev.filter(s => s !== symptomName)
        : [...prev, symptomName]
    )
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
          <TouchableOpacity 
            onPress={() => deleteNote(item.id)} 
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
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
        <Text style={styles.headerTitle}>My Notes</Text>
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

      <TouchableOpacity style={styles.fab} onPress={() => openNoteModal()}>
        <Icon name="add" size={24} color="#FFF" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false)
          resetNoteForm()
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderContent}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false)
                  resetNoteForm()
                }}
                style={styles.modalButton}
              >
                <Icon name="chevron-back" size={24} color="#333" />
                <Text style={styles.modalButtonText}>Notes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveNote} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.noteSection}>
              <TextInput
                style={styles.titleInput}
                placeholder="Title"
                value={noteTitle}
                onChangeText={setNoteTitle}
                placeholderTextColor="#666"
              />
              <ScrollView style={styles.contentInputContainer}>
                <TextInput
                  style={styles.contentInput}
                  placeholder="Start writing..."
                  value={noteContent}
                  onChangeText={setNoteContent}
                  multiline
                  textAlignVertical="top"
                  placeholderTextColor="#666"
                />
              </ScrollView>
            </View>

            <View style={styles.separator} />

            <View style={styles.moodSection}>
              <Text style={styles.sectionTitle}>How are you feeling?</Text>
              <View style={styles.iconGrid}>
                {moods.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.iconContainer}
                    onPress={() => setSelectedMood(item.id)}
                  >
                    <Image
                      source={selectedMood === item.id ? item.color : item.outline}
                      style={styles.icon}
                    />
                    <Text style={styles.iconText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.habitsSection}>
              <Text style={styles.sectionTitle}>What have you done today?</Text>
              <View style={styles.iconGrid}>
                {habits.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.iconContainer}
                    onPress={() => toggleHabit(item.id)}
                  >
                    <Image
                      source={selectedHabits.includes(item.id) ? item.color : item.outline}
                      style={styles.icon}
                    />
                    <Text style={styles.iconText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.symptomsSection}>
              <Text style={styles.sectionTitle}>Any symptoms?</Text>
              <View style={styles.iconGrid}>
                {symptoms.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.iconContainer}
                    onPress={() => toggleSymptom(item.id)}
                  >
                    <Image
                      source={selectedSymptoms.includes(item.id) ? item.color : item.outline}
                      style={styles.icon}
                    />
                    <Text style={styles.iconText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#196EB0",
    marginBottom: 16,
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
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#196EB0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notesList: {
    padding: 16,
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
    backgroundColor: '#578FCA',
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
    padding: 0,
  },
  contentInputContainer: {
    minHeight: 250,
    maxHeight: 250,
    marginBottom: 16,
  },
  contentInput: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    padding: 0,
    textAlignVertical: "top",
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
    marginBottom: 8,
  },
  selectedIcon: {
    backgroundColor: "#F0F9FF",
    borderRadius: 8,
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