package com.wproject.pet.entity;



import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.validation.constraints.NotNull;


import com.wproject.pet.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Member {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private int memberid;
	@NotNull
	private String userid;
	@NotNull
	private String password;
	
	//@NotNull
	private String name;
	
	//@NotNull
	private String tel;
	//@NotNull
	//private String address;
	//@NotNull
	private String email;
	
	private String nickname;
	
	@Enumerated(EnumType.STRING)
	private Role role;
	 
	 @Builder
	 public Member(int mid,String userid, String password,String name,String tel, String email, String nickname) {
		 this.memberid=mid;
		 this.userid=userid;
		 this.password=password;
		 this.name=name;
		 this.tel=tel;
		 this.email=email;
		 this.nickname=nickname;
		 
		
	 }


	public void setRole(String roleUser) {
		// TODO Auto-generated method stub
		this.role = Role.valueOf(roleUser);
	}

	
  
}