import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Button } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

const UploadStatusScreen = ({navigation}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    openImagePicker()
  }, [])
  
  const openImagePicker = async () => {
    try {
      const image = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,
      });

      setSelectedImage(image);
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  const uploadStatus = () => {
    // Implement the logic to upload the selectedImage to Cloudinary and
    // include the caption in the request
    // Once uploaded, you can handle further actions (e.g., storing the Cloudinary URL)
  };

  return (
    <View>
      <View>
        {selectedImage ? (
          <Image source={{ uri: selectedImage.path }} style={{ width: 200, height: 200 }} />
        ) : (
          <Text>No image selected</Text>
        )}
        <Button title="Select Image" onPress={openImagePicker} />
      </View>
      <TextInput
        placeholder="Write a caption..."
        value={caption}
        onChangeText={setCaption}
      />
      <Button title="Upload Status" onPress={uploadStatus} />
    </View>
  );
};

export default UploadStatusScreen;
