package com.wproject.pet.service;

import java.util.Random;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.wproject.pet.entity.Member;
import com.wproject.pet.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MailService {
	private final JavaMailSenderImpl mailSender;
	 private int authNumber;
	 private final MemberRepository memberRepository;
		private final BCryptPasswordEncoder encoder;

	 
	//난수 발생
		public void makeRandomNumber() {
			// 난수의 범위 111111 ~ 999999 (6자리 난수)
			Random r = new Random();
			int checkNum = r.nextInt(888888) + 111111;
			System.out.println("인증번호 : " + checkNum);
			authNumber = checkNum;
		}
		
	 
	 public void pwfind(String email, String userid) {
		
				makeRandomNumber();
				String setFrom = "kimdahyeon32@gmail.com"; // email-config에 설정한 자신의 이메일 주소를 입력 
				String toMail = email;
				String title = "House of Animal 임시비밀번호 발송 이메일 입니다."; // 이메일 제목 
				String content = 
						"홈페이지를 방문해주셔서 감사합니다." + 	//html 형식으로 작성 ! 
		                "<br><br>" + 
					    "임시 비밀번호는 " + authNumber + "입니다." + 
					    "<br>" + 
					    "임시 비밀번호로 로그인후 마이페이지에서 비밀번호 변경을 해주세요."; //이메일 내용 삽입
				mailSend(setFrom, toMail, title, content);
				Member member = memberRepository.findByUserid(userid);
				 String encPassword = encoder.encode(Integer.toString(authNumber));
				 member.setPassword(encPassword);
				 memberRepository.save(member);
				
		 
		
	 }
	 
	//이메일 전송 메소드
		public void mailSend(String setFrom, String toMail, String title, String content) { 
			MimeMessage message = mailSender.createMimeMessage();
			// true 매개값을 전달하면 multipart 형식의 메세지 전달이 가능.문자 인코딩 설정도 가능하다.
			try {
				MimeMessageHelper helper = new MimeMessageHelper(message,true,"utf-8");
				helper.setFrom(setFrom);
				helper.setTo(toMail);
				helper.setSubject(title);
				// true 전달 > html 형식으로 전송 , 작성하지 않으면 단순 텍스트로 전달.
				helper.setText(content,true);
				mailSender.send(message);
			} catch (MessagingException e) {
				e.printStackTrace();
			}
		}


}
