package com.pict.alumni.alumni_portal.controller.alumni;


import com.pict.alumni.alumni_portal.entity.Alumni;
import com.pict.alumni.alumni_portal.service.AlumniService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/alumni")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AlumniController {

    private final AlumniService alumniService;

    // Save or Update Alumni
    @PostMapping
    public ResponseEntity<Alumni> saveAlumni(@RequestBody Alumni alumni) {

        Alumni saved = alumniService.saveOrUpdateAlumni(alumni);
        return ResponseEntity.ok(saved);
    }

    // Get Alumni by Enrollment
    @GetMapping("/{enrollmentNo}")
    public ResponseEntity<Alumni> getAlumni(@PathVariable String enrollmentNo) {

        Alumni alumni = alumniService.getAlumniByEnrollment(enrollmentNo);
        return ResponseEntity.ok(alumni);
    }
//    @PostMapping
//    public ResponseEntity<?> save(@RequestBody Alumni alumni) {
//        System.out.println(alumni);
//        return ResponseEntity.ok(alumniService.saveOrUpdateAlumni(alumni));
//    }
}