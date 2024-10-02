package vn.fs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.fs.entity.Category;
import vn.fs.entity.Image;
import vn.fs.entity.Product;

import java.util.List;

public interface ImageReposity extends JpaRepository<Image,Long> {
    List<Image> findByProduct(Product product);
}
