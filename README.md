# README

# BLIND TASTE Technical Documentation
Created by: Kat Leight

BLIND TASTE is a full stack application that allows a user to login and host or join a blind wine tasting party, view party details, rate wines, and view and search the tastings they've completed.
 

## SUMMARY
Ever hosted a blind wine tasting party, but then were too drunk to tally up the final scores and determine a winner?  
Honestly, everyone's a winner at a wine tasting, but this app allows you to easily keep track of wine tasting scores, and does the math for you, so all you need to worry about what kind of cheese and crackers you're going to serve!   Additionally, this app keeps track of the wines you've tasted, so you can go back and look at what you liked (or didn't).  

APP FEATURES

This app allows a user to login with a username and password.  
A new user can create an account (username must be unique and password must containt and uppercase letter, lowercase letter, number and be at least 6 characters long).
A user can view their upcoming and past parties and details.   
A user can create a new party (as a host) or join an existing party.  
The user can delete a party from their list.  
A host can cancel a party (removes from everyone's upcoming parties list).   
A host can add/delete wines to taste from the party.    
Both a host and a user can rate the wines at a party giving it a numbers score and tastings notes.  
Both a host and a user can update their ratings while the party is open.  
Hosts can view the wine brands and assigned letters.  
Users can only view the assigned letters to the wines.  
A host can open and close a party to ratings.
A host can open the results to a party, which all users attending can view.  
The app automatically determines a winner based on highest average score (excluding the host scores).  
The app will list all final wine scores in order from highest average to lowest average.  
A user can view all tastings they've completed from all closed parties (open parties excluded), which include wine information, score, and notes.  
A user can search through their tastings by brand, score, and wine type (red, white, etc).
User's account information, parties, and tastigns are stored in a postgresQL database, so the information is stored from session to session.   

## API
The backend of this app is set up as a Ruby on Rails API to fetch user, party, wine, and tasting information. 

## MOBILE SPECIFIC STYLING

Currently, this app is only styled for use on mobile devices. Future iterations will include desktop styling. 

## BACKGROUND INFORMATION

SET UP YOUR PARTY

Log in and create a new party. Ask each guest to bring two bottles of the same wine in a bag so no one else can see what they've brought. For each wine, put one in a paper bag for party tasting and set one aside as a prize for the winner.  
Go to your party page and add each bottle wine to your party. The app will assign a letter to the wine. Write this letter on the outside of the paper bag of the wine. It is best to wait until all guests have arrived so you can mix up the order of the tastings.  
We recommend you ask guests to all bring the same type of wine (Red, white, sparking) for tasting. If you're feeling wild, you can leave it open to wild cards.   
As your guests arrive direct them to the app and have them join your party using the instructions below by giving your party ID (located on your party page).

JOIN A PARTY

Click Ask your host for their party ID. Log in and click join party. Once the host has added the wines to the party, new tastings will appear.  

TIME TO TASTE  

Grab the glasses and set out the brie, it's time to taste!  
Have each guest pour about one ounce of wine per tasting. Each guest should then rate the wines on a scale of one (nasty sauce) to ten (angle tears in your mouth) Hosts can rate wines too, but to prevent you from tipping the scales on scores, your ratings don't count in the final tally.  

FIND A WINNER  
 
Once all the tasting is complete, it's time to find the most highly rated wine! Go to your party page and click total scores. This will close your party for tasting, so make sure everyon is finished! (If you do find stragglers, you can open the party again via your party page.)  
The winner will be the wine with the highest average rating, but you'll see the scores for all the wines, just in case you want to split the prize wine among second and third place too. Or be ruthless and let the winner take all!  

WINE TYPES

Wine types include: White, Red, Sparkling, Rose, Dessert.

WINE NAME & WINE VARIETY  

Wines will have a name and a variety, sometimes both, or sometimes only one. The wine variety is the varitey of grapes used to make the wine, like Pinot Noir, Chardonnay, or Syrah. Sometimes a wine also has a fancy name like 19 Crimes' "Snoop Cali Red" (variety: Red Blend). To help 

Future iterations will allow all the search filters to work in tandem. It may also include a connection to an outside API to help autopopulate the add a wine form and further ensure the integrity of the tasting data being stored in the database, an option to join a party by scanning a QR code provided by the host, and an option to take a picture of a wine label and add it to your tasting notes.  

## TECHNOLOGY
This app was created using Ruby on Rails, JWT, ActiveRecord, Javascript, HTML, CSS, and postgresQL. 

## DEPLOYMENT
Backend repo: https://github.com/leightkt/pour-taste-backend
To use this app, download the backend files from the repo, cd into the backend folder, and run bundle install, then rails db:migrate.  
Run your rails server on port 9000 with rails s -p 9000.  
Download the frontend and run lite-server. 

## DEMONSTRATION
A demostration of the app can be viewed here: https://youtu.be/9kxwHwgc114 