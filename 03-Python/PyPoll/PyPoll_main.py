import os
import csv

csvpath = os.path.join("PyPoll\\Resources\election_data.csv")

with open(csvpath) as csvfile:

    csvreader = csv.reader(csvfile, delimiter=',')

    csv_header = next(csvreader)
    
    all_rows = []
    for row in csvreader:
        all_rows.append(row)

    #each row repsents 1 vote, so total votes is length of dataset
    total_voters = len(all_rows)    

    #create empty dictionaries to store vote counts and percentages
    voter_tally = {}
    percentages = {}

    #loop through canidate row to create canidate key and tally votes
    for row in all_rows:
        if row[2] not in voter_tally:
            voter_tally[row[2]] = 1
        else:
            voter_tally[row[2]] += 1

    #populate percentages dict by looping through voter_tally dict
    for key in voter_tally:
        percentages[key] = voter_tally[key] / total_voters 
    
    #returns key with highest value
    mostVotes = max(percentages,key=percentages.get)

    print(f"Election Results")
    print(f"-------------------------")
    print(f"Total Votes: {total_voters}")
    print(f"-------------------------")
    print(f"Khan: {round(percentages['Khan']*100)}% ({voter_tally['Khan']})")
    print(f"Correy: {round(percentages['Correy']*100)}% ({voter_tally['Correy']})")
    print(f"Li: {round(percentages['Li']*100)}% ({voter_tally['Li']})")
    print(f"O'Tooley: {round(percentages['''O'Tooley''']*100)}% ({voter_tally['''O'Tooley''']})")
    print(f"-------------------------")
    print(f"Winner: {mostVotes}")
    print(f"-------------------------")

output_path = "PyPoll\\Analysis\\PyPoll_results.txt"
with open(output_path, 'w') as text:
    text.write(f"Election Results\n")
    text.write(f"-------------------------\n")
    text.write(f"Total Votes: {total_voters}\n")
    text.write(f"-------------------------\n")
    text.write(f"Khan: {round(percentages['Khan']*100)}% ({voter_tally['Khan']})\n")
    text.write(f"Correy: {round(percentages['Correy']*100)}% ({voter_tally['Correy']})\n")
    text.write(f"Li: {round(percentages['Li']*100)}% ({voter_tally['Li']})\n")
    text.write(f"O'Tooley: {round(percentages['''O'Tooley''']*100)}% ({voter_tally['''O'Tooley''']})\n")
    text.write(f"-------------------------\n")
    text.write(f"Winner: {mostVotes}\n")
    text.write(f"-------------------------\n")