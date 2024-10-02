/*
 * (C) Copyright 2022. All Rights Reserved.
 *
 * @author DongTHD
 * @date Mar 10, 2022
*/
package vn.fs.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.fs.repository.UserRepository;
import vn.fs.service.SendMailService;
import vn.fs.utils.SendMailUtil;

@CrossOrigin("*")
@RestController
@RequestMapping("api/send-mail")
public class SendMailApi {

	@Autowired
	SendMailService sendMail;
	@Autowired
	SendMailUtil senMail;

	@Autowired
	UserRepository Urepo;
	// Xác nhận tài khoản email gửi mã OPT về email khách hàng
	@PostMapping("/otp")
	public ResponseEntity<Integer> sendOpt(@RequestBody String email) {
		int random_otp = (int) Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
		if (Urepo.existsByEmail(email)) {
			return ResponseEntity.notFound().build();
		}
		sendMailOtp(email, random_otp, "Xác nhận tài khoản!");
		return ResponseEntity.ok(random_otp);
	}

	// sendmail lấy mã OTP
	public void sendMailOtp(String email, int Otp, String title) {
		String body = "<div>\r\n" + "        <h3>Mã OTP của bạn là (Hãy bảo mật không đề người khác biết): <span style=\"color:red; font-weight: bold;\">"
				+ Otp + "</span></h3>\r\n" + "    </div>";
		sendMail.queue(email, title, body);
	}


}