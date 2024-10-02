package vn.fs.api;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.fs.dto.MessageResponse;
import vn.fs.entity.Category;
import vn.fs.entity.Image;
import vn.fs.entity.Product;
import vn.fs.repository.CategoryRepository;
import vn.fs.repository.ImageReposity;
import vn.fs.repository.ProductRepository;

import javax.validation.Valid;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin("*")
@RestController
@RequestMapping("api/image")
public class ImageApi {
    @Autowired
    ImageReposity repo;
    @Autowired
    ProductRepository prepo;

    private static String UPLOAD_DIR  = System.getProperty("user.dir") + "/src/main/resources/static/photos/";
    @GetMapping
    public ResponseEntity<List<Image>> getAll() {
        return ResponseEntity.ok(repo.findAll());
    }
    //Lấy thông tin ảnh theo id
    @GetMapping("{id}")
    public ResponseEntity<Image> getById(@PathVariable("id") Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(repo.findById(id).get());
    }
    //Lấy danh sách ảnh theo id sản phẩm
    @GetMapping("product/{id}")
    public ResponseEntity<List<Image>> getByProduct(@PathVariable("id") Long id) {
        if (!prepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Product p = prepo.findById(id).get();
        return ResponseEntity.ok(repo.findByProduct(p));
    }
    //cập nhật ảnh theo id
    @PutMapping("{id}")
    public ResponseEntity<Image> put(@PathVariable("id") Long id, @RequestBody Image image) {
        if (!id.equals(image.getImageId())) {
            return ResponseEntity.badRequest().build();
        }
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(repo.save(image));
    }
    @PostMapping
    public ResponseEntity<Image> post(@RequestBody Image image) {
        if (repo.existsById(image.getImageId())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(repo.save(image));
    }
    @PutMapping("/uploadImage")
    public ResponseEntity<?> uploadImage(@Valid @RequestBody Image imageRequest) {
        try {
            if (imageRequest.getFile() == null) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Lỗi: Không tìm thấy người dùng để thay đổi hình đại diện !"));
            }
            Optional<Image> image = repo.findById(imageRequest.getImageId());
            if (!image.isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Lỗi: Không tìm thấy người dùng để đổi mật khẩu!"));
            }
            image.get().setFile(imageRequest.getFile());
            repo.save(image.get());
            return ResponseEntity.ok(new MessageResponse("Đổi hình đại diện người dùng thành công!"));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(new MessageResponse("Lỗi: Có lỗi xảy ra trong quá trình xử lý!"));
        }
    }


}

