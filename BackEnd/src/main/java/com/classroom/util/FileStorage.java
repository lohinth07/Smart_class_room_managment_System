package com.classroom.util;

import java.io.*;
import java.nio.file.*;

public class FileStorage {

    public static void save(String path,String data) throws IOException{

        Files.write(Paths.get(path),data.getBytes());

    }

    public static String read(String path) throws IOException{

        return new String(Files.readAllBytes(Paths.get(path)));

    }

}