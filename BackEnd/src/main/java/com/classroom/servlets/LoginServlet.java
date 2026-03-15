package com.classroom.servlets;

import com.classroom.utils.FileHandler;
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;

public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String user = request.getParameter("username");
        String pass = request.getParameter("password");
        String role = request.getParameter("role");

        // Cors Headers
        response.setHeader("Access-Control-Allow-Origin", "*");
        
        if (user == null || pass == null || role == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"status\":\"ERROR\", \"message\":\"Missing parameters\"}");
            return;
        }

        String authResult = FileHandler.authenticate(user, pass, role);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        if ("SUCCESS".equals(authResult)) {
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write("{\"status\":\"SUCCESS\", \"message\":\"Login successful\", \"role\":\"" + role + "\"}");
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"status\":\"FAILURE\", \"message\":\"Invalid credentials\"}");
        }
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}
