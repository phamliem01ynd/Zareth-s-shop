/*
 * (C) Copyright 2022. All Rights Reserved.
 *
 * @author DongTHD
 * @date Mar 10, 2022
*/
package vn.fs.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.fs.entity.Favorite;
import vn.fs.entity.Product;
import vn.fs.entity.User;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

	// lay ra danh sach yeu thich boi nguoi dung
	List<Favorite> findByUser(User user);
	// đếm số sản phẩm
	Integer countByProduct(Product product);
	// tìm kiếm sản phẩm yêu thích  bởi người dùng và sản phẩm
	Favorite findByProductAndUser(Product product, User user);

}
