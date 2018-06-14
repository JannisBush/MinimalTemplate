library(tidyverse)
#library(lme4)

setwd("/data/Share/SS18/Kurse/PsyLab/Data")

# read the data
d = readr::read_csv('results_Object-biases-in-visual-attentionPilot2_JannisAndTill.csv') %>% 
  # only look at main trials
  filter(block != "practice") %>%
  # kick out all participants with less than 85% correct in the main trials
  group_by(submission_id) %>% mutate(correctnessScore = mean(ifelse(correct == 'true', 1, 0))) %>% 
  filter(correctnessScore > 0.85) %>% ungroup() %>%
  # only look at correct trials (correct==true) and kick out catch trials (target!=false)
  filter(correct == "true" & target != "false") %>% 
  #### only for test data, changed in the experiment so not necessary (forbidden) for the the real data v
  mutate(org = as.integer(org),
         timeBCT = as.factor(timeBCT),
         orgPrime = ifelse(org <= 1, org,org+1),
         target = as.integer(target),
         targetPrime = ifelse(target <= 1, target,target+1)) %>%
  ####^
  # get the main conditions valid_cue vs invalid_cue 
  mutate(conditionCue = factor(case_when( orgPrime == targetPrime ~ "valid_cue",
                                            TRUE ~ "invalid_cue"), ordered = T, levels = c("valid_cue", "invalid_cue"))) %>%
  # get the condition left vs right visual field
  mutate(conditionField = factor(case_when((targetPrime == 0 | targetPrime == 4) ~ "left_field",
                                           TRUE ~ "right_field"), ordered = T, levels = c("left_field", "right_field"))) %>%
  # get the condition horizontal vs vertical orientation
  mutate(conditionOrientation = factor(case_when(rotate == "false" ~ "vertical",
                                                 TRUE ~ "horizontal"), ordered = T, levels = c("horizontal", "vertical")))
  
d_clean = d  %>% group_by(conditionCue, conditionField, conditionOrientation) %>%
  # kick out fastest 2.5% for all three main conditions (conditionCue, conditionField, conditionOrientation)
  # and kick out slowest 2.5% for all conditions
  mutate(outlier = ifelse(log(RT) > quantile(log(RT), probs = 0.975), 1, 
                          ifelse(log(RT) < quantile(log(RT), probs = 0.025), 1, 0))) %>% ungroup() %>%
  filter(outlier == 0)
  
# Summarize the RTs
dsummary = d_clean %>% group_by(conditionCue, conditionField, conditionOrientation, timeBCT) %>% 
  summarize(meanRT = mean(RT)) %>% 
  ungroup() 
dsummary

# plot condition valid cue vs invalid cue
ggplot(d_clean, aes(y = log(RT), x = conditionCue)) + geom_violin()
ggplot(d_clean, aes(x = log(RT), color = conditionCue)) + geom_density()

# plot condition left_field vs right_field
ggplot(d_clean, aes(y = log(RT), x = conditionField)) + geom_violin()
ggplot(d_clean, aes(x = log(RT), color = conditionField)) + geom_density()

# plot condition horizontal vs vertical orientation
ggplot(d_clean, aes(y = log(RT), x = conditionOrientation)) + geom_violin()
ggplot(d_clean, aes(x = log(RT), color = conditionOrientation)) + geom_density()

# plot condition timeBCT 
ggplot(d_clean, aes(y = log(RT), x = timeBCT)) + geom_violin()
ggplot(d_clean, aes(x = log(RT), color = timeBCT)) + geom_density()

# TODO check if all combinations of conditions are normal distributed


# do a linear model to predict log RT valid_cue vs invalid_cue, left vs right and horizontal vs vertical and timeBCT
modLM = lm(log(RT) ~ conditionCue + conditionField + conditionOrientation + timeBCT, data = d_clean)  
summary(modLM)

# do a three-way ANOVA to predict log RT valid_cue vs invalid_cue, left vs right and horizontal vs vertical
modAOV = aov(log(RT) ~ conditionCue + conditionField + conditionOrientation + timeBCT, data = d_clean)  
summary(modAOV)

######################SECOND ANALYSIS ONLY INVALID CUES###########################

# second analysis only for the invalid cues 
d_invalid = d %>% 
  # kick out all valid_cues
  filter(conditionCue == "invalid_cue") %>%
  # divide invalid_cue in between_object (cued) and within_object (uncued)
  mutate(conditionRectangle = factor(case_when((rotate == "false" & abs(orgPrime - targetPrime) > 1) | (rotate == "true" & abs(orgPrime - targetPrime) == 1) ~ "within_object",
                                           TRUE ~ "between_object"), ordered = T, levels = c("within_object", "between_object"))) %>%
# divide invalid_cue in between_field (horizontal) and within_field (vertical)
mutate(conditionShift = factor(case_when((rotate == "false" & conditionRectangle == "within_object") | (rotate == "true" & conditionRectangle == "between_object") ~ "vertical_shift",
                                         TRUE ~ "horizontal_shift"), ordered = T, levels = c("vertical_shift", "horizontal_shift")))

d_invalid_clean = d_invalid %>% group_by(conditionField, conditionRectangle, conditionShift) %>% 
  # kick out fastest 2.5% for all three main conditions (conditionField, conditionRectangle, conditionShift)
  # and kick out slowest 2.5% for all conditions
  mutate(outlier = ifelse(log(RT) > quantile(log(RT), probs = 0.975), 1, 
                          ifelse(log(RT) < quantile(log(RT), probs = 0.025), 1, 0))) %>% ungroup() %>%
  filter(outlier == 0)

# Summarize the RTs
d_invalid_summary = d_invalid_clean %>% group_by(conditionRectangle, conditionField, conditionShift) %>% 
  summarize(meanRT = mean(RT)) %>% 
  ungroup() 
d_invalid_summary

# TODO check if all combinations of conditions are normal distributed 

# plot condition between_object vs within_object
ggplot(d_invalid_clean, aes(y = log(RT), x = conditionRectangle)) + geom_violin()
ggplot(d_invalid_clean, aes(x = log(RT), color = conditionRectangle)) + geom_density()

# plot condition left_field vs right_field
ggplot(d_invalid_clean, aes(y = log(RT), x = conditionField)) + geom_violin()
ggplot(d_invalid_clean, aes(x = log(RT), color = conditionField)) + geom_density()

# plot condition horizontal vs vertical shift
ggplot(d_invalid_clean, aes(y = log(RT), x = conditionShift)) + geom_violin()
ggplot(d_invalid_clean, aes(x = log(RT), color = conditionShift)) + geom_density()

# do a linear model to predict log RT between_object vs within_object, left_field vs right_field and horizontal_shift vs vertical_shift
modInvalidLM = lm(log(RT) ~ conditionRectangle + conditionField + conditionShift, data = d_invalid_clean)  
summary(modInvalidLM)

# do a three-way ANOVA to predict log RT between_object vs within_object, left_field vs right_field and horizontal_shift vs vertical_shift
modInvalidAOV = aov(log(RT) ~ conditionRectangle + conditionField + conditionShift, data = d_invalid_clean)
summary(modInvalidAOV)

######

# Additional exploratory stuff
# TODO add analysis of blocks
# TODO questions at start etc. 
# maybe do a hierachial model 
# modInvalidLMER = lmer(log(RT) ~ conditionRectangle + conditionField + conditionShift + (1 | submission_id), data = d_invalid)
# summary(modInvalidLMER)
# TODO add further plots and analyses