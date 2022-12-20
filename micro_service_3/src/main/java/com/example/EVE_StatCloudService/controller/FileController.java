package com.example.EVE_StatCloudService.controller;


import com.example.fileloader.misc.StreamUtils;
import com.example.fileloader.model.FileEntry;
import com.example.fileloader.service.FileEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.zeroturnaround.zip.ZipUtil;

import javax.servlet.ServletContext;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.sql.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/general")
public class FileController {


    @Autowired
    private ServletContext servletContext;

    @GetMapping(value = "/mysql/execute")
    public String mysql_execute(HttpServletRequest request, @RequestParam("sql") String sql) {

        String result = "Fail to execute! There are some errors!";


        String JDBC_DRIVER = "com.mysql.cj.jdbc.Driver";
        String DB_URL = "jdbc:mysql://localhost:3306/microService_3?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";

        // 数据库的用户名与密码，需要根据自己的设置
        String USER = "root";
        String PASS = "Xcz990208";

        Connection conn = null;
        Statement stmt = null;

        try{
            // 注册 JDBC 驱动
            Class.forName(JDBC_DRIVER);

            // 打开链接
            conn = DriverManager.getConnection(DB_URL,USER,PASS);

            stmt = conn.createStatement();


            stmt.execute(sql);


            stmt.close();
            conn.close();

            return "Successfully execute! Check your item info in the home search box!";
        }catch(SQLException se){
            // 处理 JDBC 错误
            se.printStackTrace();
        }catch(Exception e){
            // 处理 Class.forName 错误
            e.printStackTrace();
        }finally{
            // 关闭资源
            try{
                if(stmt!=null) stmt.close();
            }catch(SQLException se2){
            }// 什么都不做
            try{
                if(conn!=null) conn.close();
            }catch(SQLException se){
                se.printStackTrace();
            }
        }
        return result;
    }
    @GetMapping(value = "/mysql/executeQuery")
    public List<List> mysql_executeQuery(HttpServletRequest request, @RequestParam("sql") String sql) {

        String JDBC_DRIVER = "com.mysql.cj.jdbc.Driver";
        String DB_URL = "jdbc:mysql://database-lol.chy7cu9rusdl.us-east-2.rds.amazonaws.com:3306/microService_3?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";

        // 数据库的用户名与密码，需要根据自己的设置
        String USER = "admin";
        String PASS = "team_lol";


        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        List<List> result = new ArrayList<>();

        try{
            // 注册 JDBC 驱动
            Class.forName(JDBC_DRIVER);

            // 打开链接
            conn = DriverManager.getConnection(DB_URL,USER,PASS);

            stmt = conn.createStatement();


            rs = stmt.executeQuery(sql);

            while (rs.next()) {
                List<String> currentLine = new ArrayList<>();
                currentLine.add(rs.getString("order_id"));
                currentLine.add(rs.getString("region_id"));
                currentLine.add(rs.getString("type_id"));
                currentLine.add(rs.getString("date"));
                currentLine.add(rs.getString("highest"));
                currentLine.add(rs.getString("lowest"));
                currentLine.add(rs.getString("average"));
                currentLine.add(rs.getString("order_count"));
                currentLine.add(rs.getString("volume"));

                result.add(currentLine);

            }

            stmt.close();
            conn.close();


        }catch(SQLException se){
            // 处理 JDBC 错误
            se.printStackTrace();
        }catch(Exception e){
            // 处理 Class.forName 错误
            e.printStackTrace();
        }finally{
            // 关闭资源
            try{
                if(stmt!=null) stmt.close();
            }catch(SQLException se2){
            }// 什么都不做
            try{
                if(conn!=null) conn.close();
            }catch(SQLException se){
                se.printStackTrace();
            }
        }
        return result;
    }



}
