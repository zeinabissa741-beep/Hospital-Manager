from Bio import SeqIO
import sys

#checking if file is fasta
def is_fasta (fileName):
    with open(fileName, "r") as handle:
        fasta = SeqIO.parse(handle, "fasta")
        return any(fasta)
    
def main(fasta_path, user_id, job_type):
    output = []
    if (is_fasta(fasta_path)):
        for seq_record in SeqIO.parse(fasta_path, "fasta"):
            output.append(f"ID: {seq_record.id}")
            output.append(f"Seq: {repr(seq_record.seq)}")
            output.append(f"Length: {len(seq_record)}")
    else:
        output.append("Invalid FASTA file")
    return "\n".join(output)

if __name__ == "__main__":
    result = main(sys.argv[1], sys.argv[2], sys.argv[3])
    print(result)