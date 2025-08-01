package dev.mvc.team5.places;

import lombok.Data;

@Data
public class PlacesDTO {
    private Long placeno;
    private String placename;
    private String hosu;
    
    private Long schoolgwanno;  // SchoolGwan PK
    private String schoolgwanname;
}
