# Story Maker

Story Maker creates customizable bedtime stories for children through a fixed six-chapter narrative and curated choices.

## Story domain

**Story**:
A six-chapter bedtime narrative assembled from one selected Feature Option for each Chapter; its Chapters are generated sequentially.
_Avoid_: tale, book, session

**Chapter**:
One of the six ordered parts of a Story, generated and presented independently while preserving the narrative context of earlier chapters.
_Avoid_: scene, step

**Chapter Role**:
The fixed narrative purpose assigned to a Chapter: Main Character, Story Setting, Adventure Theme, Supporting Friend, Magical Element, or Resolution Style.
_Avoid_: chapter type, feature set

**Feature Option**:
One curated choice returned by the API for a Chapter and selectable by the user to customize a Story.
_Avoid_: prompt, customization, free-text choice

**Story Configuration**:
The ordered set of selected Feature Option IDs, one for each Chapter, that determines a Story; the API remains the source of their display metadata.
_Avoid_: story prompt, preferences

**Story Draft**:
An in-progress Story whose Chapter selections or generated Chapters are not yet complete.
_Avoid_: partial story, unfinished book

## Reading experiences

**Story Mode**:
A reading experience in which all six Feature Options are selected before generation begins, then Chapters are generated and read sequentially.
_Avoid_: batch mode, full-story mode

**Guided Adventure**:
A reading experience in which the user selects each Chapter's Feature Option as the Story progresses; its choices and narrative content are the same as Story Mode.
_Avoid_: adventure mode, interactive mode

**Chapter Length**:
The user-selected target size for each generated Chapter, offered as 30, 100, or 250 words.
_Avoid_: word limit, reading speed

**Global Setting**:
A setting that applies to the whole Story rather than one Chapter, including language and Chapter Length.
_Avoid_: story option, chapter setting

## Family controls and persistence

**Parent Control**:
An optional adult-gated control area that can lock usage or selected Global Settings, including the available reading experiences and Chapter Length.
_Avoid_: admin settings, parental account

**Favorite**:
A locally saved Story Configuration and its Global Settings that the user marks for convenient return; reopening starts generation from Chapter 1 without saved text or reading position.
_Avoid_: bookmark, saved prompt
