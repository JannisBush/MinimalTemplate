library(tidyverse)

setwd("F:/SS18/Kurse/PsyLab/")
#setwd("/data/Share/SS18/Kurse/PsyLab")
#setwd("C:/Users/tillh/Desktop/Programming/R/Homework")

# read the data
d = readr::read_csv("results_final.csv") %>% 
  # only look at main trials
  filter(block != "practice") %>%
  # kick out all participants with less than 85% correct in the main trials
  group_by(submission_id) %>% mutate(correctnessScore = mean(ifelse(correct == 'true', 1, 0))) %>%
  filter(correctnessScore > 0.85) %>% ungroup() %>%
  # only look at correct trials (correct==true) and kick out catch trials (target!=false)
  filter(correct == "true" & target != "false") %>%
  # change some columns to be in the right format
  mutate(org = as.integer(org),
         timeBCT = as.factor(timeBCT),
         orgPrime = org,
         target = as.integer(target),
         targetPrime = target
         ) %>%
  # get the main conditions valid_cue vs invalid_cue
  mutate(conditionCue = factor(
    case_when( orgPrime == targetPrime ~ "valid_cue",
               TRUE ~ "invalid_cue"),
    ordered = T, levels = c("valid_cue", "invalid_cue"))) %>%
  # get the condition left vs right visual field
  mutate(conditionField = factor(
    case_when((targetPrime == 0 | targetPrime == 4) ~ "left_field",
              TRUE ~ "right_field"),
    ordered = T, levels = c("left_field", "right_field"))) %>%
  # get the condition horizontal vs vertical orientation
  mutate(conditionOrientation = factor(
    case_when(rotate == "false" ~ "vertical",
              TRUE ~ "horizontal"),
    ordered = T, levels = c("horizontal", "vertical")))

# remove outliers
d_clean = d  %>% group_by(conditionCue, conditionField, conditionOrientation) %>%
  # kick out fastest 2.5% for all three main conditions (conditionCue, conditionField, conditionOrientation)
  # and kick out slowest 2.5% for all conditions
  mutate(outlier = ifelse(log(RT) > quantile(log(RT), probs = 0.975), 1,
                          ifelse(log(RT) < quantile(log(RT), probs = 0.025), 1, 0))) %>% ungroup() %>%
  filter(outlier == 0)

# summarize the RTs
dsummary = d_clean %>% group_by(conditionCue, conditionField, conditionOrientation, timeBCT) %>%
  summarize(meanRT = mean(RT)) %>%
  ungroup()
dsummary

meanCue = d_clean %>% #group_by(conditionCue) %>%
  summarize(meanRT = mean(RT)) %>%
  ungroup()
meanCue

# plot condition valid cue vs invalid cue
ggplot(d_clean, aes(y = log(RT), x = conditionCue)) + geom_violin()
ggplot(d_clean, aes(x = log(RT), color = conditionCue)) + geom_density()

ggplot(d_clean, aes(x = happy, color = happy)) + geom_density()

# plot condition left_field vs right_field
ggplot(d_clean, aes(y = log(RT), x = conditionField)) + geom_violin()
ggplot(d_clean, aes(x = log(RT), color = conditionField)) + geom_density()

# plot condition horizontal vs vertical orientation
ggplot(d_clean, aes(y = log(RT), x = conditionOrientation)) + geom_violin()
ggplot(d_clean, aes(x = log(RT), color = conditionOrientation)) + geom_density()

# plot condition timeBCT
ggplot(d_clean, aes(y = log(RT), x = timeBCT)) + geom_violin()
ggplot(d_clean, aes(x = log(RT), color = timeBCT)) + geom_density()

# do a linear model to predict log RT
# valid_cue vs invalid_cue, left vs right and horizontal vs vertical and timeBCT
modLM = lm(log(RT) ~ conditionCue + conditionField + conditionOrientation + timeBCT, data = d_clean)
summary(modLM)

# check if all combinations of conditions are normal distributed
qqnorm(modLM$residuals)
qqline(modLM$residuals)

######################SECOND ANALYSIS ONLY INVALID CUES###########################

# second analysis only for the invalid cues
d_invalid = d %>%
  # kick out all valid_cues
  filter(conditionCue == "invalid_cue") %>%
  # divide invalid_cue in between_object (cued) and within_object (uncued)
  mutate(conditionRectangle = factor(
    case_when((rotate == "false" & abs(orgPrime - targetPrime) > 1)
              | (rotate == "true" & abs(orgPrime - targetPrime) == 1) ~ "within_object",
              TRUE ~ "between_object"),
    ordered = T, levels = c("within_object", "between_object"))) %>%
  # divide invalid_cue in between_field (horizontal) and within_field (vertical)
  mutate(conditionShift = factor(
    case_when((rotate == "false" & conditionRectangle == "within_object")
              | (rotate == "true" & conditionRectangle == "between_object") ~ "vertical_shift",
              TRUE ~ "horizontal_shift"),
    ordered = T, levels = c("vertical_shift", "horizontal_shift")))

# remove outliers
d_invalid_clean = d_invalid %>% group_by(conditionField, conditionRectangle, conditionShift) %>%
  # kick out fastest 2.5% for all three main conditions (conditionField, conditionRectangle, conditionShift)
  # and kick out slowest 2.5% for all conditions
  mutate(outlier = ifelse(log(RT) > quantile(log(RT), probs = 0.975), 1,
                          ifelse(log(RT) < quantile(log(RT), probs = 0.025), 1, 0))) %>% ungroup() %>%
  filter(outlier == 0)

# summarize the RTs
d_invalid_summary = d_invalid_clean %>% group_by(conditionRectangle, conditionField, conditionShift) %>%
  summarize(meanRT = mean(RT)) %>%
  ungroup()
d_invalid_summary

# plot condition between_object vs within_object
ggplot(d_invalid_clean, aes(y = log(RT), x = conditionRectangle)) + geom_violin()
ggplot(d_invalid_clean, aes(x = log(RT), color = conditionRectangle)) + geom_density()

# plot condition left_field vs right_field
ggplot(d_invalid_clean, aes(y = log(RT), x = conditionField)) + geom_violin()
ggplot(d_invalid_clean, aes(x = log(RT), color = conditionField)) + geom_density()

# plot condition horizontal vs vertical shift
ggplot(d_invalid_clean, aes(y = log(RT), x = conditionShift)) + geom_violin()
ggplot(d_invalid_clean, aes(x = log(RT), color = conditionShift)) + geom_density()

# do a linear model to predict log RT
# between_object vs within_object, left_field vs right_field and horizontal_shift vs vertical_shift
modInvalidLM = lm(log(RT) ~ conditionRectangle + conditionField + conditionShift, data = d_invalid_clean)
summary(modInvalidLM)

# check if all combinations of conditions are normal distributed
qqnorm(modInvalidLM$residuals)
qqline(modInvalidLM$residuals)

######

# Additional exploratory stuff
# add analysis of blocks
# questions at start etc.
# maybe do a hierachial model
# library(lme4)
# modInvalidLMER = lmer(log(RT) ~ conditionRectangle + conditionField + conditionShift + (1 | submission_id), data = d_invalid)
# summary(modInvalidLMER)
# add further plots and analyses
