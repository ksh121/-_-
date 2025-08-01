package dev.mvc.team5.block;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import dev.mvc.team5.block.BlockDTO.BlockedUserDTO;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/blocks")
public class BlockController {

    @Autowired
    private BlockService service;

    @GetMapping
    public List<BlockDTO> getAll() {
        return service.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public BlockDTO get(@PathVariable(name="id") Long id) {
        return toDTO(service.findById(id).orElseThrow());
    }

    @PostMapping
    public BlockDTO create(@RequestBody BlockDTO dto) {
        return toDTO(service.save(dto));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable(name="id") Long id) {
        service.delete(id);
    }
    
    @GetMapping("/list/{userno}")
    public List<BlockedUserDTO> getMyBlockList(@PathVariable(name="userno") Long userno) {
    	return service.getBlockedUsers(userno);
    }
    @DeleteMapping("/unblock")
    public ResponseEntity<?> unblockUser(
            @RequestParam(name = "blockerUserno") Long blockerUserno,
            @RequestParam(name = "blockedUserno") Long blockedUserno) {
    	service.unblockUser(blockerUserno, blockedUserno);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/unblock/{blockno}")
    public void unblock(@PathVariable(name="blockno") Long blockno) {
        service.unblock(blockno);
    }
    
    @GetMapping("/isBlocked")
    public boolean isBlocked(@RequestParam(name="blocker", defaultValue="") Long blocker, @RequestParam(name="blocked", defaultValue="") Long blocked) {
        return service.isBlocked(blocker, blocked);
    }

    private BlockDTO toDTO(Block b) {
        BlockDTO dto = new BlockDTO();
        dto.setBlockno(b.getBlockno());
        dto.setBlocker(b.getBlocker().getUserno());
        dto.setBlocked(b.getBlocked().getUserno());
        dto.setCreatedAt(b.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        return dto;
    }
}
