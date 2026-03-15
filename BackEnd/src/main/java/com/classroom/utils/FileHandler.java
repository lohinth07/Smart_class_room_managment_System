package com.classroom.utils;

import java.io.*;
import java.nio.file.*;
import java.util.*;

public class FileHandler {
    // Store data in a temp dir or local user dir to ensure write access
    private static final String DATA_DIR = System.getProperty("user.home") + File.separator + "classroom_data";
    private static final String USERS_FILE = DATA_DIR + File.separator + "users.txt";

    static {
        try {
            File dir = new File(DATA_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            File users = new File(USERS_FILE);
            if (!users.exists()) {
                users.createNewFile();
                // Seed some default users (Format: username,password,role)
                writeLine(USERS_FILE, "admin,password,admin");
                writeLine(USERS_FILE, "teacher1,password,teacher");
                writeLine(USERS_FILE, "student1,password,student");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static synchronized void writeLine(String filePath, String data) throws IOException {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(filePath, true))) {
            bw.write(data);
            bw.newLine();
        }
    }

    public static List<String> readAllLines(String filePath) throws IOException {
        File f = new File(filePath);
        if (!f.exists()) return new ArrayList<>();
        return Files.readAllLines(f.toPath());
    }

    public static String authenticate(String username, String password, String role) {
        try {
            List<String> users = readAllLines(USERS_FILE);
            for (String line : users) {
                String[] parts = line.split(",");
                if (parts.length >= 3) {
                    if (parts[0].equals(username) && parts[1].equals(password) && parts[2].equalsIgnoreCase(role)) {
                        return "SUCCESS";
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "FAILURE";
    }
}
