package ropold.backend.service;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CloudinaryService  {

    private final Cloudinary cloudinary;

    public void uploadImage(MultipartFile image) throws IOException {
        cloudinary.uploader().upload(image, Collections.emptyMap());
    }
}
