// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract GlobalStorage {
    struct Record {
        string farmerId;
        string kycHash;
        string lenderId;
        string applicationId;
    }

    Record[] public records;

    event RecordAdded(
        uint256 indexed recordId,
        string farmerId,
        string kycHash,
        string lenderId,
        string applicationId

    );

    function addRecord(Record calldata rec) external {
        uint256 recordId = records.length;

        records.push(Record({
            farmerId: rec.farmerId,
            kycHash: rec.kycHash,
            lenderId: rec.lenderId,
            applicationId: rec.applicationId
        }));

        emit RecordAdded(
            recordId,
            rec.farmerId,
            rec.kycHash,
            rec.lenderId,
            rec.applicationId
        );
    }

    function getRecord(uint256 id) external view returns (Record memory) {
        require(id < records.length, "Invalid ID");
        return records[id];
    }

    function recordCount() external view returns (uint256) {
        return records.length;
    }

    function getRecords(uint256 start, uint256 limit) external view returns (Record[] memory) {
        require(start < records.length, "Start out of bounds");
        uint256 end = start + limit > records.length ? records.length : start + limit;
        Record[] memory result = new Record[](end - start);
        for (uint256 i = start; i < end; i++) {
            result[i - start] = records[i];
        }
        return result;
    }
}


//already deployed