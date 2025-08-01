package dev.mvc.team5.block;

import dev.mvc.team5.block.BlockDTO.BlockedUserDTO;
import dev.mvc.team5.user.User;
import dev.mvc.team5.user.UserRepository;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BlockService {

    @Autowired
    private BlockRepository repo;

    @Autowired
    private UserRepository userRepo;

    public List<Block> findAll() {
        return repo.findAll();
    }

    public Optional<Block> findById(Long id) {
        return repo.findById(id);
    }

    public Block save(BlockDTO dto) {
        Block block = new Block();
        User blocker = userRepo.findById(dto.getBlocker()).orElseThrow();
        User blocked = userRepo.findById(dto.getBlocked()).orElseThrow();

        block.setBlocker(blocker);
        block.setBlocked(blocked);
        block.setCreatedAt(LocalDateTime.now());

        return repo.save(block);
    }
    @Transactional
    public void blockUser(Long targetUserno, String reason) {
        // 이미 활성 차단이면 건너뜀
        if (repo.existsByBlocked_UsernoAndActiveTrue(targetUserno)) return;

        Block block = new Block();
        block.setBlocker(null);                                   // 시스템 차단
        block.setBlocked(userRepo.getReferenceById(targetUserno));
        block.setReason(reason);
        block.setActive(true);
        block.setCreatedAt(LocalDateTime.now());

        repo.save(block);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
 // 사용자가 차단한 사람 목록 보기
    public List<BlockedUserDTO> getBlockedUsers(Long blockerUserno) {
        return repo.findByBlockerUserno(blockerUserno)
                .stream()
                .map(block -> {
                    BlockedUserDTO dto = new BlockedUserDTO();
                    dto.setUserno(block.getBlocked().getUserno());
                    dto.setUsername(block.getBlocked().getUsername());
                    dto.setEmail(block.getBlocked().getEmail());
                    return dto;
                })
                .collect(Collectors.toList());
    }
    @Transactional
    public void unblockUser(Long blockerUserno, Long blockedUserno) {
    	repo.deleteByBlockerUsernoAndBlockedUserno(blockerUserno, blockedUserno);
    }

    // 차단 해제
    @Transactional
    public void unblock(Long blockno) {
        Block block = repo.findById(blockno)
            .orElseThrow(() -> new IllegalArgumentException("차단 정보 없음"));

        block.setActive(false);
    }
    // 차단 여부( 되어있는지 아닌지)
    public boolean isBlocked(Long blocker, Long blocked) {
      return repo.existsByBlocker_UsernoAndBlocked_Userno(blocker, blocked);
  }
    
    
}
