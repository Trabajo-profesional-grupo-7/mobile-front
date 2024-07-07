import {
  Dimensions,
  StyleSheet,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
  FlatList,
  ScrollView,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { API_URL, useAuth } from "../context/AuthContext";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import axios from "axios";
import LoadingIndicator from "@/components/LoadingIndicator";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

export default function Attraction() {
  const params = useLocalSearchParams();
  const name = params.attraction_name;
  let location = `${params.city}, ${params.country}`;
  if (!params.city) {
    location = `${params.country}`;
  }
  const id = params.attraction_id;
  const photo = params.photo as string;

  const [isLiked, setIsLiked] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [isRated, setIsRated] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [userRating, setUserRating] = useState(1);
  const [likedCount, setLikedCount] = useState(0);
  const [summary, setSummary] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [gmapsUri, setGmapsUri] = useState<string | null>(null);
  const [comments, setComments] = useState<
    { comment: string; comment_id: number; user_name: string }[]
  >([]);
  const [types, setTypes] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [starModalVisible, setStarModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const { onRefreshToken } = useAuth();

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const {
      type,
      nativeEvent: { timestamp, utcOffset },
    } = event;
    if (type == "set" && selectedDate) {
      setDate(selectedDate);
      schedule(selectedDate);
      setShowDatePicker(false);
    }
  };

  const getAttractionDetails = async () => {
    setIsLoading(true);
    await onRefreshToken!();
    try {
      const result = (await axios.get(`${API_URL}/attractions/byid/${id}`))
        .data;
      setIsDone(result.is_done);
      setIsLiked(result.is_liked);
      setIsSaved(result.is_saved);
      setLikedCount(result.liked_count);
      setComments(result.comments);
      setTypes(result.types);
      setSummary(result.editorial_summary);
      setGmapsUri(result.google_maps_uri);
      setAddress(result.formatted_address);
      if (result.user_rating != null) {
        setUserRating(result.user_rating);
        setIsRated(true);
      }
    } catch (e) {
      alert(e);
    }
    setIsLoading(false);
  };

  const like = async () => {
    setIsLoading(true);
    await onRefreshToken!();
    try {
      if (isLiked) {
        await axios.delete(`${API_URL}/attractions/unlike?attraction_id=${id}`);
        setIsLiked(false);
      } else {
        await axios.post(`${API_URL}/attractions/like?attraction_id=${id}`);
        setIsLiked(true);
      }
    } catch (e) {
      alert(e);
    }
    setIsLoading(false);
  };

  const done = async () => {
    setIsLoading(true);
    await onRefreshToken!();
    try {
      if (isDone) {
        await axios.delete(`${API_URL}/attractions/undone?attraction_id=${id}`);
        setIsDone(false);
      } else {
        await axios.post(`${API_URL}/attractions/done?attraction_id=${id}`);
        setIsDone(true);
      }
    } catch (e) {
      alert(e);
    }
    setIsLoading(false);
  };

  const schedule = async (selectedDate: Date) => {
    setIsLoading(true);
    await onRefreshToken!();
    try {
      await axios.post(`${API_URL}/attractions/schedule`, {
        attraction_id: id,
        scheduled_time: selectedDate.toISOString(),
      });
    } catch (e) {
      alert(e);
    }
    setShowDatePicker(false);
    setIsLoading(false);
  };

  const rate = async (rating: number) => {
    setIsLoading(true);
    await onRefreshToken!();
    try {
      await axios.post(
        `${API_URL}/attractions/rate?attraction_id=${id}&rating=${rating}`
      );
      setIsRated(true);
      setUserRating(rating);
    } catch (e) {
      alert(e);
    }
    setIsLoading(false);
  };

  const save = async () => {
    setIsLoading(true);
    await onRefreshToken!();
    try {
      if (isSaved) {
        await axios.delete(`${API_URL}/attractions/unsave?attraction_id=${id}`);
        setIsSaved(false);
      } else {
        await axios.post(`${API_URL}/attractions/save?attraction_id=${id}`);
        setIsSaved(true);
      }
    } catch (e) {
      alert(e);
    }
    setIsLoading(false);
  };

  const StarModal = () => {
    const [rating, setRating] = useState(userRating);

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={starModalVisible}
        onRequestClose={() => setStarModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setStarModalVisible(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <TouchableWithoutFeedback>
              <View style={{ padding: 20, borderRadius: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    paddingBottom: 20,
                    justifyContent: "center",
                    backgroundColor: "transparent",
                  }}
                >
                  <Ionicons
                    style={{ paddingHorizontal: 2 }}
                    name={"star"}
                    size={40}
                    onPress={() => {
                      setRating(1);
                    }}
                  />
                  <Ionicons
                    style={{ paddingHorizontal: 2 }}
                    name={rating >= 2 ? "star" : "star-outline"}
                    size={40}
                    onPress={() => {
                      setRating(2);
                    }}
                  />
                  <Ionicons
                    style={{ paddingHorizontal: 2 }}
                    name={rating >= 3 ? "star" : "star-outline"}
                    size={40}
                    onPress={() => {
                      setRating(3);
                    }}
                  />
                  <Ionicons
                    style={{ paddingHorizontal: 2 }}
                    name={rating >= 4 ? "star" : "star-outline"}
                    size={40}
                    onPress={() => {
                      setRating(4);
                    }}
                  />
                  <Ionicons
                    style={{ paddingHorizontal: 2 }}
                    name={rating == 5 ? "star" : "star-outline"}
                    size={40}
                    onPress={() => {
                      setRating(5);
                    }}
                  />
                </View>
                <Pressable
                  style={{ alignItems: "center" }}
                  onPress={() => {
                    rate(rating);
                    setStarModalVisible(false);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 25,
                      color: Colors.light.primary,
                      fontWeight: "bold",
                    }}
                  >
                    Rate
                  </Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const CommentModal = () => {
    const [postComment, setPostComment] = useState<string>("");
    const maxLength = 300;

    const handlePostComment = async () => {
      if (postComment.length) {
        setCommentModalVisible(false);
        setIsLoading(true);
        await onRefreshToken!();
        try {
          await axios.post(
            `${API_URL}/attractions/comment?attraction_id=${id}&comment=${postComment}`
          );
          getAttractionDetails()
          setPostComment("");
        } catch (e) {
          alert(e);
        }
        setIsLoading(false);
      } else {
        alert("Can't post an empty comment!");
      }
    };

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={commentModalVisible}
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <Pressable
          onPress={() => setCommentModalVisible(false)}
          style={styles.modalOverlay}
        >
          <Pressable style={styles.modalView}>
            <Text style={{ fontSize: 8 * 5 }}>
              Tell us about{" "}
              <Text
                style={{ fontWeight: "bold", color: Colors.light.secondary }}
              >
                {name}
              </Text>
            </Text>
            <TextInput
              value={postComment}
              onChangeText={setPostComment}
              maxLength={maxLength}
              placeholder="Type a comment..."
              style={styles.input}
              multiline
            />
            <Text style={{ fontSize: 8 * 2, color: "gray" }}>
              {postComment.length}/{maxLength}
            </Text>

            <TouchableOpacity onPress={handlePostComment} style={styles.button}>
              <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    );
  };

  useEffect(() => {
    getAttractionDetails();
  }, []);

  const transformType = (type: string): string => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 8 * 3 }}
        style={styles.container}
      >
        <Image
          style={{ width: "100%", height: 8 * 32 }}
          source={
            photo ? { uri: photo } : { uri: "https://i.imgur.com/qc0GM7G.png" }
          }
        />
        <View style={{ marginHorizontal: 8 * 3 }}>
          <Text style={styles.title}>{name}</Text>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="location-outline" size={8 * 2.5} color="gray" />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ fontSize: 8 * 2.5, color: "gray" }}
            >
              {location}
            </Text>
          </View>
          <View style={[{ flexDirection: "row" }, styles.floatingButton]}>
            <Ionicons
              style={styles.icon}
              name={isLiked ? "heart" : "heart-outline"}
              size={8 * 4.5}
              onPress={like}
            />
            <Ionicons
              style={styles.icon}
              name={isDone ? "checkmark-done-outline" : "checkmark-outline"}
              size={8 * 4.5}
              onPress={done}
            />
            <Ionicons
              style={styles.icon}
              name={isScheduled ? "calendar" : "calendar-outline"}
              size={8 * 4.5}
              onPress={() => {
                setShowDatePicker(true);
              }}
            />
            <Ionicons
              style={styles.icon}
              name={isRated ? "star" : "star-outline"}
              size={8 * 4.5}
              onPress={() => {
                setStarModalVisible(true);
              }}
            />
            <Ionicons
              style={styles.icon}
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={8 * 4.5}
              onPress={save}
            />
            <Ionicons style={styles.icon} name="map-outline" size={8 * 4.5} />
          </View>
          {types.length > 0 ? (
            <Text
              numberOfLines={2}
              style={{ fontSize: 8 * 2, marginBottom: 2, fontStyle: "italic" }}
            >
              {types.map(transformType).join(", ")}
            </Text>
          ) : null}
          {summary != null && (
            <Text
              numberOfLines={16}
              ellipsizeMode="tail"
              style={{ fontSize: 8 * 3 }}
            >
              {summary}
            </Text>
          )}
          <Text style={{ fontSize: 8 * 3.5, fontWeight: "bold", marginTop: 4 }}>
            Comments
          </Text>
          {comments.length === 0 ? (
            <Text style={{ fontStyle: "italic", fontSize: 16, paddingLeft: 8 }}>
              No comments available
            </Text>
          ) : (
            <View style={{ paddingBottom: 8 }}>
              {comments.map((comment) => (
                <View
                  key={comment.comment_id}
                  style={{ paddingLeft: 8, paddingVertical: 4 }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    {comment.user_name}
                  </Text>
                  <Text style={{ fontSize: 16, paddingLeft: 4 }}>
                    {comment.comment}
                  </Text>
                </View>
              ))}
            </View>
          )}
          <Text
            onPress={() => setCommentModalVisible(true)}
            style={{
              color: Colors.light.primary,
              fontWeight: "bold",
              paddingLeft: 8 * 3,
              marginTop: 8 * 2,
              fontSize: 8 * 2.5,
            }}
          >
            {" "}
            +Add comment{" "}
          </Text>
        </View>

        <StarModal />
        <CommentModal />
      </ScrollView>
      {showDatePicker && (
        <RNDateTimePicker
          value={date}
          onChange={onChangeDate}
          minimumDate={new Date()}
        />
      )}
      {isLoading && <LoadingIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 8 * 4,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 4,
  },
  icon: {
    paddingHorizontal: 2,
    color: "#454545",
  },
  input: {
    width: windowWidth * 0.8,
    margin: 12,
    marginTop: 8 * 4,
    borderWidth: 0,
    borderBottomWidth: 1,
    padding: 10,
    borderBottomColor: Colors.light.primary,
    fontSize: 8 * 2,
  },
  floatingButton: {
    zIndex: 1,
    width: windowWidth * 0.8,
    height: 60,
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    marginVertical: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalView: {
    height: "80%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 8 * 4,
    alignItems: "center",
  },
  button: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    borderRadius: 10,
    width: windowWidth * 0.6,
    marginTop: 8 * 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
});
